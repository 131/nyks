package nyks_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"math"
	"os/exec"
	"reflect"
	"testing"

	nyksdate "github.com/131/nyks/v6/date"
	"github.com/131/nyks/v6/object"
	nyksstring "github.com/131/nyks/v6/string"
)

func reference(t *testing.T, script string, input any) []any {
	t.Helper()
	node, err := exec.LookPath("node")
	if err != nil {
		t.Skip("Node is not installed")
	}
	if exec.Command(node, "-e", "require.resolve('mout/lang/kindOf')").Run() != nil {
		t.Skip("npm dependencies are not installed")
	}
	body, err := json.Marshal(input)
	if err != nil {
		t.Fatal(err)
	}
	cmd := exec.Command(node, "-e", "const fs = require('fs'); const input = JSON.parse(fs.readFileSync(0, 'utf8')); "+script)
	cmd.Stdin = bytes.NewReader(body)
	output, err := cmd.CombinedOutput()
	if err != nil {
		t.Fatalf("JS reference: %v: %s", err, output)
	}
	var results []any
	if err := json.Unmarshal(output, &results); err != nil {
		t.Fatal(err)
	}
	return results
}

func equalJSON(t *testing.T, actual, expected any) {
	t.Helper()
	body, err := json.Marshal(actual)
	if err != nil {
		t.Fatal(err)
	}
	var normalized any
	if err := json.Unmarshal(body, &normalized); err != nil {
		t.Fatal(err)
	}
	if !reflect.DeepEqual(normalized, expected) {
		t.Fatalf("Go %#v, JS %#v", normalized, expected)
	}
}

func TestReplaceEnvMatchesJS(t *testing.T) {
	env := map[string]any{
		"E0": "env.E1", "E1": "done", "RECURSIVE": "$${env.E1}", "ESCAPED": "$$$$env.E1",
		"key-name": "dash", "key.with.dot": "dot", "": "empty", "NULL": nil,
		"OBJECT": map[string]any{"x": 1}, "ARRAY": []any{"first", "second"},
		"BOOL": false, "NUMBER": 1e20, "SMALL": 1e-7,
	}
	dict := map[string]any{
		"env": env, "name": "Joe", "color": "blue", "dollars": "$$ cash", "prefix": "$`", "suffix": "$'",
		"unicode": "é😀", "literal": "$1-$0-$name", "env.E1": "direct",
	}
	inputs := []string{
		"$env.E1", "$$env.E1", "${env.E1}", "$${env.E1}", "${${env.E0}}", "$${$${env.E0}}",
		"$${env.RECURSIVE}", "$${env.ESCAPED}", "$${env[\"E1\"]}", "$${env['key.with.dot']}",
		"$${env[\"\"]}", "$${\"env\".\"E1\"}", "$$env.key-name", "$${env.MISSING}", "$${env.e1}",
		"prefix ${env.E1} / $$env.E1 suffix", "Hi $$name, $${color} is great", "$$name $$color $$name",
		"é😀 $$name $$color", "$$unicode $$color", "a $$dollars z", "a $$prefix z", "a $$suffix z", "a $$literal z",
		"a $${env.NULL} z", "a $${env.OBJECT} z", "$${env.ARRAY}", "$${env.ARRAY.0}", "$${env.ARRAY.length}",
		"$${env.BOOL}", "$${env.NUMBER}", "$${env.SMALL}", "plain",
	}
	expected := reference(t, `const replaceEnv = require('./string/replaceEnv'); process.stdout.write(JSON.stringify(input.inputs.map(s => replaceEnv(s, input.dict))));`, map[string]any{"dict": dict, "inputs": inputs})
	for i, input := range inputs {
		t.Run(input, func(t *testing.T) { equalJSON(t, nyksstring.ReplaceEnv(input, dict), expected[i]) })
	}
}

func TestReplaceEnvLongChainAndObjects(t *testing.T) {
	env := map[string]any{"E20": "done"}
	for i := 0; i < 20; i++ {
		env[fmt.Sprintf("E%d", i)] = fmt.Sprintf("$$$$env.E%d", i+1)
	}
	actual := nyksstring.ReplaceEnv("$$env.E0", map[string]any{"env": env})
	if actual != "done" {
		t.Fatalf("long chain: %v", actual)
	}
	original := map[string]any{"value": "before"}
	result := nyksstring.ReplaceEnv("$$obj", map[string]any{"obj": original}).(map[string]any)
	result["value"] = "after"
	if original["value"] != "after" {
		t.Fatal("object result was cloned")
	}
	if nyksstring.ReplaceEnv("a $$value z", map[string]any{"value": nil}) != nil {
		t.Fatal("null result was not preserved")
	}
}

func TestJqdiveMatchesJS(t *testing.T) {
	dict := map[string]any{
		"env":    map[string]any{"E1": "done", "NULL": nil, "key.with.dot": "dot", "": "empty", "ARRAY": []any{"first", nil}},
		"env.E1": "direct",
	}
	paths := [][]string{{}, {"env"}, {"env.E1"}, {"env", "E1"}, {"env['E1']"}, {"env[\"key.with.dot\"]"},
		{"env[\"\"]"}, {"env.MISSING"}, {"env.e1"}, {"env.NULL"}, {"env.NULL.x"}, {"env.NULL", "x"},
		{"env.ARRAY.0"}, {"env.ARRAY.1"}, {"env.ARRAY.01"}, {"env.ARRAY.length"}, {""}, {".env..E1."}}
	expected := reference(t, `const dive = require('./object/jqdive'); process.stdout.write(JSON.stringify(input.paths.map(path => { const value = dive(input.dict, ...path); return {exists: value !== undefined, value: value === undefined ? null : value}; })));`, map[string]any{"dict": dict, "paths": paths})
	for i, path := range paths {
		t.Run(fmt.Sprint(path), func(t *testing.T) {
			value, exists := object.Jqdive(dict, path...)
			equalJSON(t, map[string]any{"exists": exists, "value": value}, expected[i])
		})
	}
}

func TestWalkMatchesJS(t *testing.T) {
	inputs := []any{nil, true, 42, "text", []any{"a", nil, false, 3},
		map[string]any{"$$key": "value", "nested": []any{map[string]any{"x": "a"}, "b"}, "null": nil}}
	expected := reference(t, `const walk = require('./object/walk'); process.stdout.write(JSON.stringify(input.map(tree => walk(tree, value => ({original: value})))));`, inputs)
	for i, input := range inputs {
		t.Run(fmt.Sprint(i), func(t *testing.T) {
			equalJSON(t, object.Walk(input, func(value string) any { return map[string]any{"original": value} }), expected[i])
		})
	}
	root := map[string]any{"$$key": "value", "null": nil, "number": 42}
	object.Walk(root, func(value string) any { return "changed" })
	if root["$$key"] != "changed" || root["null"] != nil || root["number"] != 42 {
		t.Fatal("Walk changed keys or scalar types")
	}
}

func TestHumanDiffMatchesJS(t *testing.T) {
	type diff struct {
		Seconds float64 `json:"seconds"`
		Max     int     `json:"max"`
		Format  string  `json:"format"`
	}
	var cases []diff
	for _, seconds := range []float64{0, .656, 1, -1, 59, 60, 3601, 86400 * 31, 86400*365 + 11*3600, 1e30} {
		for _, max := range []int{0, 1, 2, 6, -1, -20} {
			for _, format := range []string{nyksdate.FormatLight, nyksdate.FormatFull} {
				cases = append(cases, diff{seconds, max, format})
			}
		}
	}
	expected := reference(t, `const humanDiff = require('./date/humanDiff'); process.stdout.write(JSON.stringify(input.map(c => humanDiff(c.seconds, c.max, c.format))));`, cases)
	for i, c := range cases {
		t.Run(fmt.Sprint(c), func(t *testing.T) { equalJSON(t, nyksdate.HumanDiff(c.Seconds, c.Max, c.Format), expected[i]) })
	}
	if nyksdate.HumanDiff(3601, 2) != "1h 1s" {
		t.Fatal("default format differs")
	}
}

func TestGoHelpersWithoutNode(t *testing.T) {
	value, exists := object.Jqdive(map[string]any{"env": map[string]string{"USER": "alice"}}, "env.USER")
	if !exists || value != "alice" {
		t.Fatal("map lookup failed")
	}
	value, exists = object.Jqdive(map[string]any{"null": nil}, "null")
	if !exists || value != nil {
		t.Fatal("explicit null became missing")
	}
	_, exists = object.Jqdive(map[string]any{}, "missing")
	if exists {
		t.Fatal("missing property was found")
	}
	root := map[string]any{"$$key": "value", "nested": []any{"a", 42, nil}}
	object.Walk(root, func(value string) any { return "(" + value + ")" })
	if root["$$key"] != "(value)" || root["nested"].([]any)[0] != "(a)" || root["nested"].([]any)[1] != 42 {
		t.Fatal("native walker failed")
	}
	if nyksdate.HumanDiff(0, 2) != "0s" || nyksdate.HumanDiff(.656, 2) != "1s" || nyksdate.HumanDiff(86400*31, 2) != "1month 1d" {
		t.Fatal("light date formatting failed")
	}
	if nyksdate.HumanDiff(3601, 2, nyksdate.FormatFull) != "1 hour 1 s" {
		t.Fatal("full date formatting failed")
	}
	if nyksdate.HumanDiff(math.NaN(), 2) != "0s" {
		t.Fatal("NaN date formatting failed")
	}
}
