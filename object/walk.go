package object

// Walk transforms string values in a JSON-compatible map/slice tree in place.
// Keys, null and non-string scalar values are preserved. Processor results
// replace strings directly, without walking the newly returned value.
func Walk(value any, processor func(string) any) any {
	switch value := value.(type) {
	case map[string]any:
		for key, child := range value {
			value[key] = Walk(child, processor)
		}
		return value
	case []any:
		for index, child := range value {
			value[index] = Walk(child, processor)
		}
		return value
	case string:
		return processor(value)
	default:
		return value
	}
}
