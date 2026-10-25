package object

import (
	"regexp"
	"strconv"
)

var pathPattern = regexp.MustCompile(`^(?:"([^"]*)"|'([^']*)'|([a-zA-Z0-9_-]+)|\["([^"]*)"\]|\['([^']*)'\])`)

// Jqdive follows nyks/object/jqdive on JSON-compatible maps and slices.
// The bool distinguishes a missing property from an explicitly null value.
// An exact non-null key takes precedence over interpreting a path.
func Jqdive(value any, paths ...string) (any, bool) {
	for _, path := range paths {
		if value == nil {
			return nil, false
		}
		if direct, ok := property(value, path); ok && direct != nil {
			value = direct
			continue
		}
		for path != "" && value != nil {
			if path[0] == '.' {
				path = path[1:]
				continue
			}
			match := pathPattern.FindStringSubmatchIndex(path)
			if match == nil {
				return nil, false
			}
			var key string
			for i := 2; i < len(match); i += 2 {
				if match[i] >= 0 {
					key = path[match[i]:match[i+1]]
					break
				}
			}
			var ok bool
			value, ok = property(value, key)
			if !ok {
				return nil, false
			}
			path = path[match[1]:]
		}
	}
	return value, true
}

func property(value any, key string) (any, bool) {
	switch value := value.(type) {
	case map[string]any:
		result, ok := value[key]
		return result, ok
	case map[string]string:
		result, ok := value[key]
		return result, ok
	case []any:
		if key == "length" {
			return len(value), true
		}
		index, err := strconv.Atoi(key)
		if err == nil && index >= 0 && index < len(value) && strconv.Itoa(index) == key {
			return value[index], true
		}
	}
	return nil, false
}
