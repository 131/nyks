// Package js provides the scalar string conversion shared by the Go helpers.
package js

import (
	"encoding/json"
	"fmt"
	"math"
	"strconv"
)

// String follows JavaScript String for JSON scalars and native numbers.
func String(value any) string {
	var number float64
	switch value := value.(type) {
	case string:
		return value
	case bool:
		return strconv.FormatBool(value)
	case float64:
		number = value
	case float32:
		number = float64(value)
	case json.Number:
		number, _ = strconv.ParseFloat(string(value), 64)
	case int, int8, int16, int32, int64, uint, uint8, uint16, uint32, uint64:
		body, _ := json.Marshal(value)
		number, _ = strconv.ParseFloat(string(body), 64)
	default:
		return fmt.Sprint(value)
	}
	switch {
	case number == 0:
		return "0"
	case math.IsNaN(number):
		return "NaN"
	case math.IsInf(number, 1):
		return "Infinity"
	case math.IsInf(number, -1):
		return "-Infinity"
	}
	body, _ := json.Marshal(number)
	return string(body)
}
