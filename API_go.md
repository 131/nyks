# Go API

```go
import (
    "github.com/131/nyks/v6/object"
    stringutil "github.com/131/nyks/v6/string"
    "github.com/131/nyks/v6/date"
)
```

## String

`stringutil.ReplaceEnv(text string, dict any) any`

Expands `$$key` and `$${key}`. Missing references remain literal; references
recurse. An object or null result replaces the whole input.

```go
value := stringutil.ReplaceEnv("Hi $${env.USER}", map[string]any{
    "env": map[string]string{"USER": "alice"},
}) // "Hi alice"
```

## Object

`object.Jqdive(value any, paths ...string) (any, bool)`

Reads direct, dotted and quoted paths. An exact non-null key takes precedence.
The bool distinguishes a missing property from null.

`object.Walk(value any, processor func(string) any) any`

Transforms string values in maps/slices in place. Keys, null and other scalars
are preserved; processor results are not walked again.

Trees use `map[string]any` and `[]any`; lookup also accepts `map[string]string`.
Map traversal order follows Go.

## Date

`date.HumanDiff(seconds float64, max int, format ...string) string`

```go
date.HumanDiff(3601, 2)                  // "1h 1s"
date.HumanDiff(3601, 2, date.FormatFull) // "1 hour 1 s"
```

The default format is `date.FormatLight`.

## Tests

```bash
go test -race ./...
```

Differential checks use the local JS helpers when Node/npm dependencies are available.
