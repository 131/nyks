package date

import (
	"math"
	"strconv"
	"strings"

	"github.com/131/nyks/v6/internal/js"
)

const (
	FormatLight = "FORMAT_LIGHT"
	FormatFull  = "FORMAT_FULL"
)

type diffStep struct {
	format string
	size   float64
}

var diffFormats = map[string][]diffStep{
	FormatLight: {{"%ds", 60}, {"%dm", 60}, {"%dh", 24}, {"%dd", 30}, {"%dmonth%s", 12}, {"%dy", 0}},
	FormatFull:  {{"%d s", 60}, {"%d min%s", 60}, {"%d hour%s", 24}, {"%d day%s", 30}, {"%d month%s", 12}, {"%d year%s", 0}},
}

// HumanDiff formats seconds like nyks/date/humanDiff. max is explicit in Go;
// the optional format defaults to FORMAT_LIGHT, with FORMAT_FULL also supported.
func HumanDiff(seconds float64, max int, format ...string) string {
	name := FormatLight
	if len(format) > 0 {
		name = format[0]
	}
	steps := diffFormats[name]
	first := steps[0] // Unknown formats fail natively, as in JS.
	seconds = math.Ceil(seconds)
	if seconds == 0 || math.IsNaN(seconds) {
		return strings.Replace(first.format, "%d", "0", 1)
	}
	var parts []string
	for _, step := range steps {
		var current float64
		if step.size == 0 {
			current = math.Floor(seconds)
		} else {
			current = math.Floor(math.Mod(seconds, step.size))
			seconds /= step.size
		}
		if current > 0 {
			// sprintf's %d uses parseInt on the number's JS string.
			text := js.String(current)
			end := 0
			for end < len(text) && text[end] >= '0' && text[end] <= '9' {
				end++
			}
			number := math.NaN()
			if end > 0 {
				number, _ = strconv.ParseFloat(text[:end], 64)
			}
			plural := ""
			if current > 1 {
				plural = "s"
			}
			text = strings.Replace(step.format, "%d", js.String(number), 1)
			parts = append(parts, strings.Replace(text, "%s", plural, 1))
		}
	}
	for i, j := 0, len(parts)-1; i < j; i, j = i+1, j-1 {
		parts[i], parts[j] = parts[j], parts[i]
	}
	end := max
	if end < 0 {
		end += len(parts)
	}
	if end < 0 {
		end = 0
	}
	if end > len(parts) {
		end = len(parts)
	}
	return strings.Join(parts[:end], " ")
}
