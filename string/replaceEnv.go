package stringutil

import (
	"regexp"
	"strings"

	"github.com/131/nyks/v6/internal/js"
	"github.com/131/nyks/v6/object"
)

var macroPattern = regexp.MustCompile(`\$\$([a-zA-Z0-9._-]+)|\$\$\{([^}]+)\}`)

// ReplaceEnv expands $$key and $${key} using the current JS helper's semantics.
// Missing references stay literal; object/null results replace the whole input.
// Expansions recurse natively; there is no artificial pass limit or cycle guard.
func ReplaceEnv(str string, dict any) any {
	touched := false
	for cursor := 0; cursor <= len(str); {
		match := macroPattern.FindStringSubmatchIndex(str[cursor:])
		if match == nil {
			break
		}
		end := cursor + match[1]
		keyStart, keyEnd := match[2], match[3]
		if keyStart < 0 {
			keyStart, keyEnd = match[4], match[5]
		}
		value, ok := object.Jqdive(dict, str[cursor+keyStart:cursor+keyEnd])
		if !ok {
			cursor = end
			continue
		}
		switch value.(type) {
		case nil, map[string]any, map[string]string, []any:
			return value
		}
		// nyks retains RegExp.lastIndex across string replacements (UTF-16).
		lastIndex := 0
		for _, r := range str[:end] {
			lastIndex++
			if r > 0xffff {
				lastIndex++
			}
		}
		str = replaceString(str, str[cursor+match[0]:end], js.String(value))
		cursor = macroCursor(str, lastIndex)
		touched = true
	}
	if touched {
		return ReplaceEnv(str, dict)
	}
	return str
}

// macroCursor translates JavaScript's UTF-16 lastIndex to a Go byte offset.
func macroCursor(str string, offset int) int {
	for index, r := range str {
		if offset <= 0 {
			return index
		}
		offset--
		if r > 0xffff {
			offset--
		}
	}
	if offset > 0 {
		return len(str) + 1
	}
	return len(str)
}

// replaceString follows String.replace with a string pattern/replacement.
func replaceString(str, pattern, value string) string {
	index := strings.Index(str, pattern)
	prefix, suffix := str[:index], str[index+len(pattern):]
	var out strings.Builder
	out.WriteString(prefix)
	for i := 0; i < len(value); i++ {
		if value[i] == '$' && i+1 < len(value) {
			switch value[i+1] {
			case '$':
				out.WriteByte('$')
			case '&':
				out.WriteString(pattern)
			case '`':
				out.WriteString(prefix)
			case '\'':
				out.WriteString(suffix)
			default:
				out.WriteByte(value[i])
				continue
			}
			i++
		} else {
			out.WriteByte(value[i])
		}
	}
	out.WriteString(suffix)
	return out.String()
}
