/* MooTools: the javascript framework. license: MIT-style license. copyright: Copyright (c) 2006-2015 [Valerio Proietti](http://mad4milk.net/).*/ 
/*
Web Build: http://mootools.net/more/builder/06c7a9bef3ec1597b62d745d0d583f27
*/
/*
---

script: More.js

name: More

description: MooTools More

license: MIT-style license

authors:
  - Guillermo Rauch
  - Thomas Aylott
  - Scott Kyle
  - Arian Stolwijk
  - Tim Wienk
  - Christoph Pojer
  - Aaron Newton
  - Jacob Thornton

requires:
  - Core/MooTools

provides: [MooTools.More]

...
*/

MooTools.More = {
  version: '1.5.1',
  build: '2dd695ba957196ae4b0275a690765d6636a61ccd'
};

/*
---

script: Class.Binds.js

name: Class.Binds

description: Automagically binds specified methods in a class to the instance of the class.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Class
  - MooTools.More

provides: [Class.Binds]

...
*/

Class.Mutators.Binds = function(binds){
  if (!this.prototype.initialize) this.implement('initialize', function(){});
  return Array.from(binds).concat(this.prototype.Binds || []);
};

Class.Mutators.initialize = function(initialize){
  return function(){
    Array.from(this.Binds).each(function(name){
      var original = this[name];
      if (original) this[name] = original.bind(this);
    }, this);
    return initialize.apply(this, arguments);
  };
};

/*
---

script: Class.Refactor.js

name: Class.Refactor

description: Extends a class onto itself with new property, preserving any items attached to the class's namespace.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Class
  - MooTools.More

# Some modules declare themselves dependent on Class.Refactor
provides: [Class.refactor, Class.Refactor]

...
*/

Class.refactor = function(original, refactors){

  Object.each(refactors, function(item, name){
    var origin = original.prototype[name];
    origin = (origin && origin.$origin) || origin || function(){};
    original.implement(name, (typeof item == 'function') ? function(){
      var old = this.previous;
      this.previous = origin;
      var value = item.apply(this, arguments);
      this.previous = old;
      return value;
    } : item);
  });

  return original;

};

/*
---

name: Events.Pseudos

description: Adds the functionality to add pseudo events

license: MIT-style license

authors:
  - Arian Stolwijk

requires: [Core/Class.Extras, Core/Slick.Parser, MooTools.More]

provides: [Events.Pseudos]

...
*/

(function(){

Events.Pseudos = function(pseudos, addEvent, removeEvent){

  var storeKey = '_monitorEvents:';

  var storageOf = function(object){
    return {
      store: object.store ? function(key, value){
        object.store(storeKey + key, value);
      } : function(key, value){
        (object._monitorEvents || (object._monitorEvents = {}))[key] = value;
      },
      retrieve: object.retrieve ? function(key, dflt){
        return object.retrieve(storeKey + key, dflt);
      } : function(key, dflt){
        if (!object._monitorEvents) return dflt;
        return object._monitorEvents[key] || dflt;
      }
    };
  };

  var splitType = function(type){
    if (type.indexOf(':') == -1 || !pseudos) return null;

    var parsed = Slick.parse(type).expressions[0][0],
      parsedPseudos = parsed.pseudos,
      l = parsedPseudos.length,
      splits = [];

    while (l--){
      var pseudo = parsedPseudos[l].key,
        listener = pseudos[pseudo];
      if (listener != null) splits.push({
        event: parsed.tag,
        value: parsedPseudos[l].value,
        pseudo: pseudo,
        original: type,
        listener: listener
      });
    }
    return splits.length ? splits : null;
  };

  return {

    addEvent: function(type, fn, internal){
      var split = splitType(type);
      if (!split) return addEvent.call(this, type, fn, internal);

      var storage = storageOf(this),
        events = storage.retrieve(type, []),
        eventType = split[0].event,
        args = Array.slice(arguments, 2),
        stack = fn,
        self = this;

      split.each(function(item){
        var listener = item.listener,
          stackFn = stack;
        if (listener == false) eventType += ':' + item.pseudo + '(' + item.value + ')';
        else stack = function(){
          listener.call(self, item, stackFn, arguments, stack);
        };
      });

      events.include({type: eventType, event: fn, monitor: stack});
      storage.store(type, events);

      if (type != eventType) addEvent.apply(this, [type, fn].concat(args));
      return addEvent.apply(this, [eventType, stack].concat(args));
    },

    removeEvent: function(type, fn){
      var split = splitType(type);
      if (!split) return removeEvent.call(this, type, fn);

      var storage = storageOf(this),
        events = storage.retrieve(type);
      if (!events) return this;

      var args = Array.slice(arguments, 2);

      removeEvent.apply(this, [type, fn].concat(args));
      events.each(function(monitor, i){
        if (!fn || monitor.event == fn) removeEvent.apply(this, [monitor.type, monitor.monitor].concat(args));
        delete events[i];
      }, this);

      storage.store(type, events);
      return this;
    }

  };

};

var pseudos = {

  once: function(split, fn, args, monitor){
    fn.apply(this, args);
    this.removeEvent(split.event, monitor)
      .removeEvent(split.original, fn);
  },

  throttle: function(split, fn, args){
    if (!fn._throttled){
      fn.apply(this, args);
      fn._throttled = setTimeout(function(){
        fn._throttled = false;
      }, split.value || 250);
    }
  },

  pause: function(split, fn, args){
    clearTimeout(fn._pause);
    fn._pause = fn.delay(split.value || 250, this, args);
  }

};

Events.definePseudo = function(key, listener){
  pseudos[key] = listener;
  return this;
};

Events.lookupPseudo = function(key){
  return pseudos[key];
};

var proto = Events.prototype;
Events.implement(Events.Pseudos(pseudos, proto.addEvent, proto.removeEvent));

['Request', 'Fx'].each(function(klass){
  if (this[klass]) this[klass].implement(Events.prototype);
});

})();

/*
---

script: String.Extras.js

name: String.Extras

description: Extends the String native object to include methods useful in managing various kinds of strings (query strings, urls, html, etc).

license: MIT-style license

authors:
  - Aaron Newton
  - Guillermo Rauch
  - Christopher Pitt

requires:
  - Core/String
  - Core/Array
  - MooTools.More

provides: [String.Extras]

...
*/

(function(){

var special = {
  'a': /[àáâãäåăą]/g,
  'A': /[ÀÁÂÃÄÅĂĄ]/g,
  'c': /[ćčç]/g,
  'C': /[ĆČÇ]/g,
  'd': /[ďđ]/g,
  'D': /[ĎÐ]/g,
  'e': /[èéêëěę]/g,
  'E': /[ÈÉÊËĚĘ]/g,
  'g': /[ğ]/g,
  'G': /[Ğ]/g,
  'i': /[ìíîï]/g,
  'I': /[ÌÍÎÏ]/g,
  'l': /[ĺľł]/g,
  'L': /[ĹĽŁ]/g,
  'n': /[ñňń]/g,
  'N': /[ÑŇŃ]/g,
  'o': /[òóôõöøő]/g,
  'O': /[ÒÓÔÕÖØ]/g,
  'r': /[řŕ]/g,
  'R': /[ŘŔ]/g,
  's': /[ššş]/g,
  'S': /[ŠŞŚ]/g,
  't': /[ťţ]/g,
  'T': /[ŤŢ]/g,
  'u': /[ùúûůüµ]/g,
  'U': /[ÙÚÛŮÜ]/g,
  'y': /[ÿý]/g,
  'Y': /[ŸÝ]/g,
  'z': /[žźż]/g,
  'Z': /[ŽŹŻ]/g,
  'th': /[þ]/g,
  'TH': /[Þ]/g,
  'dh': /[ð]/g,
  'DH': /[Ð]/g,
  'ss': /[ß]/g,
  'oe': /[œ]/g,
  'OE': /[Œ]/g,
  'ae': /[æ]/g,
  'AE': /[Æ]/g
},

tidy = {
  ' ': /[\xa0\u2002\u2003\u2009]/g,
  '*': /[\xb7]/g,
  '\'': /[\u2018\u2019]/g,
  '"': /[\u201c\u201d]/g,
  '...': /[\u2026]/g,
  '-': /[\u2013]/g,
//	'--': /[\u2014]/g,
  '&raquo;': /[\uFFFD]/g
},

conversions = {
  ms: 1,
  s: 1000,
  m: 6e4,
  h: 36e5
},

findUnits = /(\d*.?\d+)([msh]+)/;

var walk = function(string, replacements){
  var result = string, key;
  for (key in replacements) result = result.replace(replacements[key], key);
  return result;
};

var getRegexForTag = function(tag, contents){
  tag = tag || '';
  var regstr = contents ? "<" + tag + "(?!\\w)[^>]*>([\\s\\S]*?)<\/" + tag + "(?!\\w)>" : "<\/?" + tag + "([^>]+)?>",
    reg = new RegExp(regstr, "gi");
  return reg;
};

String.implement({

  standardize: function(){
    return walk(this, special);
  },

  repeat: function(times){
    return new Array(times + 1).join(this);
  },

  pad: function(length, str, direction){
    if (this.length >= length) return this;

    var pad = (str == null ? ' ' : '' + str)
      .repeat(length - this.length)
      .substr(0, length - this.length);

    if (!direction || direction == 'right') return this + pad;
    if (direction == 'left') return pad + this;

    return pad.substr(0, (pad.length / 2).floor()) + this + pad.substr(0, (pad.length / 2).ceil());
  },

  getTags: function(tag, contents){
    return this.match(getRegexForTag(tag, contents)) || [];
  },

  stripTags: function(tag, contents){
    return this.replace(getRegexForTag(tag, contents), '');
  },

  tidy: function(){
    return walk(this, tidy);
  },

  truncate: function(max, trail, atChar){
    var string = this;
    if (trail == null && arguments.length == 1) trail = '…';
    if (string.length > max){
      string = string.substring(0, max);
      if (atChar){
        var index = string.lastIndexOf(atChar);
        if (index != -1) string = string.substr(0, index);
      }
      if (trail) string += trail;
    }
    return string;
  },

  ms: function(){
    // "Borrowed" from https://gist.github.com/1503944
    var units = findUnits.exec(this);
    if (units == null) return Number(this);
    return Number(units[1]) * conversions[units[2]];
  }

});

})();

/*
---

script: String.QueryString.js

name: String.QueryString

description: Methods for dealing with URI query strings.

license: MIT-style license

authors:
  - Sebastian Markbåge
  - Aaron Newton
  - Lennart Pilon
  - Valerio Proietti

requires:
  - Core/Array
  - Core/String
  - MooTools.More

provides: [String.QueryString]

...
*/

String.implement({

  parseQueryString: function(decodeKeys, decodeValues){
    if (decodeKeys == null) decodeKeys = true;
    if (decodeValues == null) decodeValues = true;

    var vars = this.split(/[&;]/),
      object = {};
    if (!vars.length) return object;

    vars.each(function(val){
      var index = val.indexOf('=') + 1,
        value = index ? val.substr(index) : '',
        keys = index ? val.substr(0, index - 1).match(/([^\]\[]+|(\B)(?=\]))/g) : [val],
        obj = object;
      if (!keys) return;
      if (decodeValues) value = decodeURIComponent(value);
      keys.each(function(key, i){
        if (decodeKeys) key = decodeURIComponent(key);
        var current = obj[key];

        if (i < keys.length - 1) obj = obj[key] = current || {};
        else if (typeOf(current) == 'array') current.push(value);
        else obj[key] = current != null ? [current, value] : value;
      });
    });

    return object;
  },

  cleanQueryString: function(method){
    return this.split('&').filter(function(val){
      var index = val.indexOf('='),
        key = index < 0 ? '' : val.substr(0, index),
        value = val.substr(index + 1);

      return method ? method.call(null, key, value) : (value || value === 0);
    }).join('&');
  }

});

/*
---

script: Object.Extras.js

name: Object.Extras

description: Extra Object generics, like getFromPath which allows a path notation to child elements.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Object
  - MooTools.More

provides: [Object.Extras]

...
*/

(function(){

var defined = function(value){
  return value != null;
};

var hasOwnProperty = Object.prototype.hasOwnProperty;

Object.extend({

  getFromPath: function(source, parts){
    if (typeof parts == 'string') parts = parts.split('.');
    for (var i = 0, l = parts.length; i < l; i++){
      if (hasOwnProperty.call(source, parts[i])) source = source[parts[i]];
      else return null;
    }
    return source;
  },

  cleanValues: function(object, method){
    method = method || defined;
    for (var key in object) if (!method(object[key])){
      delete object[key];
    }
    return object;
  },

  erase: function(object, key){
    if (hasOwnProperty.call(object, key)) delete object[key];
    return object;
  },

  run: function(object){
    var args = Array.slice(arguments, 1);
    for (var key in object) if (object[key].apply){
      object[key].apply(object, args);
    }
    return object;
  }

});

})();

/*
---

script: Locale.js

name: Locale

description: Provides methods for localization.

license: MIT-style license

authors:
  - Aaron Newton
  - Arian Stolwijk

requires:
  - Core/Events
  - Object.Extras
  - MooTools.More

provides: [Locale, Lang]

...
*/

(function(){

var current = null,
  locales = {},
  inherits = {};

var getSet = function(set){
  if (instanceOf(set, Locale.Set)) return set;
  else return locales[set];
};

var Locale = this.Locale = {

  define: function(locale, set, key, value){
    var name;
    if (instanceOf(locale, Locale.Set)){
      name = locale.name;
      if (name) locales[name] = locale;
    } else {
      name = locale;
      if (!locales[name]) locales[name] = new Locale.Set(name);
      locale = locales[name];
    }

    if (set) locale.define(set, key, value);

    

    if (!current) current = locale;

    return locale;
  },

  use: function(locale){
    locale = getSet(locale);

    if (locale){
      current = locale;

      this.fireEvent('change', locale);

      
    }

    return this;
  },

  getCurrent: function(){
    return current;
  },

  get: function(key, args){
    return (current) ? current.get(key, args) : '';
  },

  inherit: function(locale, inherits, set){
    locale = getSet(locale);

    if (locale) locale.inherit(inherits, set);
    return this;
  },

  list: function(){
    return Object.keys(locales);
  }

};

Object.append(Locale, new Events);

Locale.Set = new Class({

  sets: {},

  inherits: {
    locales: [],
    sets: {}
  },

  initialize: function(name){
    this.name = name || '';
  },

  define: function(set, key, value){
    var defineData = this.sets[set];
    if (!defineData) defineData = {};

    if (key){
      if (typeOf(key) == 'object') defineData = Object.merge(defineData, key);
      else defineData[key] = value;
    }
    this.sets[set] = defineData;

    return this;
  },

  get: function(key, args, _base){
    var value = Object.getFromPath(this.sets, key);
    if (value != null){
      var type = typeOf(value);
      if (type == 'function') value = value.apply(null, Array.from(args));
      else if (type == 'object') value = Object.clone(value);
      return value;
    }

    // get value of inherited locales
    var index = key.indexOf('.'),
      set = index < 0 ? key : key.substr(0, index),
      names = (this.inherits.sets[set] || []).combine(this.inherits.locales).include('en-US');
    if (!_base) _base = [];

    for (var i = 0, l = names.length; i < l; i++){
      if (_base.contains(names[i])) continue;
      _base.include(names[i]);

      var locale = locales[names[i]];
      if (!locale) continue;

      value = locale.get(key, args, _base);
      if (value != null) return value;
    }

    return '';
  },

  inherit: function(names, set){
    names = Array.from(names);

    if (set && !this.inherits.sets[set]) this.inherits.sets[set] = [];

    var l = names.length;
    while (l--) (set ? this.inherits.sets[set] : this.inherits.locales).unshift(names[l]);

    return this;
  }

});



})();

/*
---

name: Locale.en-US.Date

description: Date messages for US English.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Locale

provides: [Locale.en-US.Date]

...
*/

Locale.define('en-US', 'Date', {

  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  months_abbr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  days_abbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

  // Culture's date order: MM/DD/YYYY
  dateOrder: ['month', 'date', 'year'],
  shortDate: '%m/%d/%Y',
  shortTime: '%I:%M%p',
  AM: 'AM',
  PM: 'PM',
  firstDayOfWeek: 0,

  // Date.Extras
  ordinal: function(dayOfMonth){
    // 1st, 2nd, 3rd, etc.
    return (dayOfMonth > 3 && dayOfMonth < 21) ? 'th' : ['th', 'st', 'nd', 'rd', 'th'][Math.min(dayOfMonth % 10, 4)];
  },

  lessThanMinuteAgo: 'less than a minute ago',
  minuteAgo: 'about a minute ago',
  minutesAgo: '{delta} minutes ago',
  hourAgo: 'about an hour ago',
  hoursAgo: 'about {delta} hours ago',
  dayAgo: '1 day ago',
  daysAgo: '{delta} days ago',
  weekAgo: '1 week ago',
  weeksAgo: '{delta} weeks ago',
  monthAgo: '1 month ago',
  monthsAgo: '{delta} months ago',
  yearAgo: '1 year ago',
  yearsAgo: '{delta} years ago',

  lessThanMinuteUntil: 'less than a minute from now',
  minuteUntil: 'about a minute from now',
  minutesUntil: '{delta} minutes from now',
  hourUntil: 'about an hour from now',
  hoursUntil: 'about {delta} hours from now',
  dayUntil: '1 day from now',
  daysUntil: '{delta} days from now',
  weekUntil: '1 week from now',
  weeksUntil: '{delta} weeks from now',
  monthUntil: '1 month from now',
  monthsUntil: '{delta} months from now',
  yearUntil: '1 year from now',
  yearsUntil: '{delta} years from now'

});

/*
---

script: Date.js

name: Date

description: Extends the Date native object to include methods useful in managing dates.

license: MIT-style license

authors:
  - Aaron Newton
  - Nicholas Barthelemy - https://svn.nbarthelemy.com/date-js/
  - Harald Kirshner - mail [at] digitarald.de; http://digitarald.de
  - Scott Kyle - scott [at] appden.com; http://appden.com

requires:
  - Core/Array
  - Core/String
  - Core/Number
  - MooTools.More
  - Locale
  - Locale.en-US.Date

provides: [Date]

...
*/

(function(){

var Date = this.Date;

var DateMethods = Date.Methods = {
  ms: 'Milliseconds',
  year: 'FullYear',
  min: 'Minutes',
  mo: 'Month',
  sec: 'Seconds',
  hr: 'Hours'
};

['Date', 'Day', 'FullYear', 'Hours', 'Milliseconds', 'Minutes', 'Month', 'Seconds', 'Time', 'TimezoneOffset',
  'Week', 'Timezone', 'GMTOffset', 'DayOfYear', 'LastMonth', 'LastDayOfMonth', 'UTCDate', 'UTCDay', 'UTCFullYear',
  'AMPM', 'Ordinal', 'UTCHours', 'UTCMilliseconds', 'UTCMinutes', 'UTCMonth', 'UTCSeconds', 'UTCMilliseconds'].each(function(method){
  Date.Methods[method.toLowerCase()] = method;
});

var pad = function(n, digits, string){
  if (digits == 1) return n;
  return n < Math.pow(10, digits - 1) ? (string || '0') + pad(n, digits - 1, string) : n;
};

Date.implement({

  set: function(prop, value){
    prop = prop.toLowerCase();
    var method = DateMethods[prop] && 'set' + DateMethods[prop];
    if (method && this[method]) this[method](value);
    return this;
  }.overloadSetter(),

  get: function(prop){
    prop = prop.toLowerCase();
    var method = DateMethods[prop] && 'get' + DateMethods[prop];
    if (method && this[method]) return this[method]();
    return null;
  }.overloadGetter(),

  clone: function(){
    return new Date(this.get('time'));
  },

  increment: function(interval, times){
    interval = interval || 'day';
    times = times != null ? times : 1;

    switch (interval){
      case 'year':
        return this.increment('month', times * 12);
      case 'month':
        var d = this.get('date');
        this.set('date', 1).set('mo', this.get('mo') + times);
        return this.set('date', d.min(this.get('lastdayofmonth')));
      case 'week':
        return this.increment('day', times * 7);
      case 'day':
        return this.set('date', this.get('date') + times);
    }

    if (!Date.units[interval]) throw new Error(interval + ' is not a supported interval');

    return this.set('time', this.get('time') + times * Date.units[interval]());
  },

  decrement: function(interval, times){
    return this.increment(interval, -1 * (times != null ? times : 1));
  },

  isLeapYear: function(){
    return Date.isLeapYear(this.get('year'));
  },

  clearTime: function(){
    return this.set({hr: 0, min: 0, sec: 0, ms: 0});
  },

  diff: function(date, resolution){
    if (typeOf(date) == 'string') date = Date.parse(date);

    return ((date - this) / Date.units[resolution || 'day'](3, 3)).round(); // non-leap year, 30-day month
  },

  getLastDayOfMonth: function(){
    return Date.daysInMonth(this.get('mo'), this.get('year'));
  },

  getDayOfYear: function(){
    return (Date.UTC(this.get('year'), this.get('mo'), this.get('date') + 1)
      - Date.UTC(this.get('year'), 0, 1)) / Date.units.day();
  },

  setDay: function(day, firstDayOfWeek){
    if (firstDayOfWeek == null){
      firstDayOfWeek = Date.getMsg('firstDayOfWeek');
      if (firstDayOfWeek === '') firstDayOfWeek = 1;
    }

    day = (7 + Date.parseDay(day, true) - firstDayOfWeek) % 7;
    var currentDay = (7 + this.get('day') - firstDayOfWeek) % 7;

    return this.increment('day', day - currentDay);
  },

  getWeek: function(firstDayOfWeek){
    if (firstDayOfWeek == null){
      firstDayOfWeek = Date.getMsg('firstDayOfWeek');
      if (firstDayOfWeek === '') firstDayOfWeek = 1;
    }

    var date = this,
      dayOfWeek = (7 + date.get('day') - firstDayOfWeek) % 7,
      dividend = 0,
      firstDayOfYear;

    if (firstDayOfWeek == 1){
      // ISO-8601, week belongs to year that has the most days of the week (i.e. has the thursday of the week)
      var month = date.get('month'),
        startOfWeek = date.get('date') - dayOfWeek;

      if (month == 11 && startOfWeek > 28) return 1; // Week 1 of next year

      if (month == 0 && startOfWeek < -2){
        // Use a date from last year to determine the week
        date = new Date(date).decrement('day', dayOfWeek);
        dayOfWeek = 0;
      }

      firstDayOfYear = new Date(date.get('year'), 0, 1).get('day') || 7;
      if (firstDayOfYear > 4) dividend = -7; // First week of the year is not week 1
    } else {
      // In other cultures the first week of the year is always week 1 and the last week always 53 or 54.
      // Days in the same week can have a different weeknumber if the week spreads across two years.
      firstDayOfYear = new Date(date.get('year'), 0, 1).get('day');
    }

    dividend += date.get('dayofyear');
    dividend += 6 - dayOfWeek; // Add days so we calculate the current date's week as a full week
    dividend += (7 + firstDayOfYear - firstDayOfWeek) % 7; // Make up for first week of the year not being a full week

    return (dividend / 7);
  },

  getOrdinal: function(day){
    return Date.getMsg('ordinal', day || this.get('date'));
  },

  getTimezone: function(){
    return this.toString()
      .replace(/^.*? ([A-Z]{3}).[0-9]{4}.*$/, '$1')
      .replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, '$1$2$3');
  },

  getGMTOffset: function(){
    var off = this.get('timezoneOffset');
    return ((off > 0) ? '-' : '+') + pad((off.abs() / 60).floor(), 2) + pad(off % 60, 2);
  },

  setAMPM: function(ampm){
    ampm = ampm.toUpperCase();
    var hr = this.get('hr');
    if (hr > 11 && ampm == 'AM') return this.decrement('hour', 12);
    else if (hr < 12 && ampm == 'PM') return this.increment('hour', 12);
    return this;
  },

  getAMPM: function(){
    return (this.get('hr') < 12) ? 'AM' : 'PM';
  },

  parse: function(str){
    this.set('time', Date.parse(str));
    return this;
  },

  isValid: function(date){
    if (!date) date = this;
    return typeOf(date) == 'date' && !isNaN(date.valueOf());
  },

  format: function(format){
    if (!this.isValid()) return 'invalid date';

    if (!format) format = '%x %X';
    if (typeof format == 'string') format = formats[format.toLowerCase()] || format;
    if (typeof format == 'function') return format(this);

    var d = this;
    return format.replace(/%([a-z%])/gi,
      function($0, $1){
        switch ($1){
          case 'a': return Date.getMsg('days_abbr')[d.get('day')];
          case 'A': return Date.getMsg('days')[d.get('day')];
          case 'b': return Date.getMsg('months_abbr')[d.get('month')];
          case 'B': return Date.getMsg('months')[d.get('month')];
          case 'c': return d.format('%a %b %d %H:%M:%S %Y');
          case 'd': return pad(d.get('date'), 2);
          case 'e': return pad(d.get('date'), 2, ' ');
          case 'H': return pad(d.get('hr'), 2);
          case 'I': return pad((d.get('hr') % 12) || 12, 2);
          case 'j': return pad(d.get('dayofyear'), 3);
          case 'k': return pad(d.get('hr'), 2, ' ');
          case 'l': return pad((d.get('hr') % 12) || 12, 2, ' ');
          case 'L': return pad(d.get('ms'), 3);
          case 'm': return pad((d.get('mo') + 1), 2);
          case 'M': return pad(d.get('min'), 2);
          case 'o': return d.get('ordinal');
          case 'p': return Date.getMsg(d.get('ampm'));
          case 's': return Math.round(d / 1000);
          case 'S': return pad(d.get('seconds'), 2);
          case 'T': return d.format('%H:%M:%S');
          case 'U': return pad(d.get('week'), 2);
          case 'w': return d.get('day');
          case 'x': return d.format(Date.getMsg('shortDate'));
          case 'X': return d.format(Date.getMsg('shortTime'));
          case 'y': return d.get('year').toString().substr(2);
          case 'Y': return d.get('year');
          case 'z': return d.get('GMTOffset');
          case 'Z': return d.get('Timezone');
        }
        return $1;
      }
    );
  },

  toISOString: function(){
    return this.format('iso8601');
  }

}).alias({
  toJSON: 'toISOString',
  compare: 'diff',
  strftime: 'format'
});

// The day and month abbreviations are standardized, so we cannot use simply %a and %b because they will get localized
var rfcDayAbbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  rfcMonthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var formats = {
  db: '%Y-%m-%d %H:%M:%S',
  compact: '%Y%m%dT%H%M%S',
  'short': '%d %b %H:%M',
  'long': '%B %d, %Y %H:%M',
  rfc822: function(date){
    return rfcDayAbbr[date.get('day')] + date.format(', %d ') + rfcMonthAbbr[date.get('month')] + date.format(' %Y %H:%M:%S %Z');
  },
  rfc2822: function(date){
    return rfcDayAbbr[date.get('day')] + date.format(', %d ') + rfcMonthAbbr[date.get('month')] + date.format(' %Y %H:%M:%S %z');
  },
  iso8601: function(date){
    return (
      date.getUTCFullYear() + '-' +
      pad(date.getUTCMonth() + 1, 2) + '-' +
      pad(date.getUTCDate(), 2) + 'T' +
      pad(date.getUTCHours(), 2) + ':' +
      pad(date.getUTCMinutes(), 2) + ':' +
      pad(date.getUTCSeconds(), 2) + '.' +
      pad(date.getUTCMilliseconds(), 3) + 'Z'
    );
  }
};

var parsePatterns = [],
  nativeParse = Date.parse;

var parseWord = function(type, word, num){
  var ret = -1,
    translated = Date.getMsg(type + 's');
  switch (typeOf(word)){
    case 'object':
      ret = translated[word.get(type)];
      break;
    case 'number':
      ret = translated[word];
      if (!ret) throw new Error('Invalid ' + type + ' index: ' + word);
      break;
    case 'string':
      var match = translated.filter(function(name){
        return this.test(name);
      }, new RegExp('^' + word, 'i'));
      if (!match.length) throw new Error('Invalid ' + type + ' string');
      if (match.length > 1) throw new Error('Ambiguous ' + type);
      ret = match[0];
  }

  return (num) ? translated.indexOf(ret) : ret;
};

var startCentury = 1900,
  startYear = 70;

Date.extend({

  getMsg: function(key, args){
    return Locale.get('Date.' + key, args);
  },

  units: {
    ms: Function.from(1),
    second: Function.from(1000),
    minute: Function.from(60000),
    hour: Function.from(3600000),
    day: Function.from(86400000),
    week: Function.from(608400000),
    month: function(month, year){
      var d = new Date;
      return Date.daysInMonth(month != null ? month : d.get('mo'), year != null ? year : d.get('year')) * 86400000;
    },
    year: function(year){
      year = year || new Date().get('year');
      return Date.isLeapYear(year) ? 31622400000 : 31536000000;
    }
  },

  daysInMonth: function(month, year){
    return [31, Date.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  },

  isLeapYear: function(year){
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  },

  parse: function(from){
    var t = typeOf(from);
    if (t == 'number') return new Date(from);
    if (t != 'string') return from;
    from = from.clean();
    if (!from.length) return null;

    var parsed;
    parsePatterns.some(function(pattern){
      var bits = pattern.re.exec(from);
      return (bits) ? (parsed = pattern.handler(bits)) : false;
    });

    if (!(parsed && parsed.isValid())){
      parsed = new Date(nativeParse(from));
      if (!(parsed && parsed.isValid())) parsed = new Date(from.toInt());
    }
    return parsed;
  },

  parseDay: function(day, num){
    return parseWord('day', day, num);
  },

  parseMonth: function(month, num){
    return parseWord('month', month, num);
  },

  parseUTC: function(value){
    var localDate = new Date(value);
    var utcSeconds = Date.UTC(
      localDate.get('year'),
      localDate.get('mo'),
      localDate.get('date'),
      localDate.get('hr'),
      localDate.get('min'),
      localDate.get('sec'),
      localDate.get('ms')
    );
    return new Date(utcSeconds);
  },

  orderIndex: function(unit){
    return Date.getMsg('dateOrder').indexOf(unit) + 1;
  },

  defineFormat: function(name, format){
    formats[name] = format;
    return this;
  },

  

  defineParser: function(pattern){
    parsePatterns.push((pattern.re && pattern.handler) ? pattern : build(pattern));
    return this;
  },

  defineParsers: function(){
    Array.flatten(arguments).each(Date.defineParser);
    return this;
  },

  define2DigitYearStart: function(year){
    startYear = year % 100;
    startCentury = year - startYear;
    return this;
  }

}).extend({
  defineFormats: Date.defineFormat.overloadSetter()
});

var regexOf = function(type){
  return new RegExp('(?:' + Date.getMsg(type).map(function(name){
    return name.substr(0, 3);
  }).join('|') + ')[a-z]*');
};

var replacers = function(key){
  switch (key){
    case 'T':
      return '%H:%M:%S';
    case 'x': // iso8601 covers yyyy-mm-dd, so just check if month is first
      return ((Date.orderIndex('month') == 1) ? '%m[-./]%d' : '%d[-./]%m') + '([-./]%y)?';
    case 'X':
      return '%H([.:]%M)?([.:]%S([.:]%s)?)? ?%p? ?%z?';
  }
  return null;
};

var keys = {
  d: /[0-2]?[0-9]|3[01]/,
  H: /[01]?[0-9]|2[0-3]/,
  I: /0?[1-9]|1[0-2]/,
  M: /[0-5]?\d/,
  s: /\d+/,
  o: /[a-z]*/,
  p: /[ap]\.?m\.?/,
  y: /\d{2}|\d{4}/,
  Y: /\d{4}/,
  z: /Z|[+-]\d{2}(?::?\d{2})?/
};

keys.m = keys.I;
keys.S = keys.M;

var currentLanguage;

var recompile = function(language){
  currentLanguage = language;

  keys.a = keys.A = regexOf('days');
  keys.b = keys.B = regexOf('months');

  parsePatterns.each(function(pattern, i){
    if (pattern.format) parsePatterns[i] = build(pattern.format);
  });
};

var build = function(format){
  if (!currentLanguage) return {format: format};

  var parsed = [];
  var re = (format.source || format) // allow format to be regex
   .replace(/%([a-z])/gi,
    function($0, $1){
      return replacers($1) || $0;
    }
  ).replace(/\((?!\?)/g, '(?:') // make all groups non-capturing
   .replace(/ (?!\?|\*)/g, ',? ') // be forgiving with spaces and commas
   .replace(/%([a-z%])/gi,
    function($0, $1){
      var p = keys[$1];
      if (!p) return $1;
      parsed.push($1);
      return '(' + p.source + ')';
    }
  ).replace(/\[a-z\]/gi, '[a-z\\u00c0-\\uffff;\&]'); // handle unicode words

  return {
    format: format,
    re: new RegExp('^' + re + '$', 'i'),
    handler: function(bits){
      bits = bits.slice(1).associate(parsed);
      var date = new Date().clearTime(),
        year = bits.y || bits.Y;

      if (year != null) handle.call(date, 'y', year); // need to start in the right year
      if ('d' in bits) handle.call(date, 'd', 1);
      if ('m' in bits || bits.b || bits.B) handle.call(date, 'm', 1);

      for (var key in bits) handle.call(date, key, bits[key]);
      return date;
    }
  };
};

var handle = function(key, value){
  if (!value) return this;

  switch (key){
    case 'a': case 'A': return this.set('day', Date.parseDay(value, true));
    case 'b': case 'B': return this.set('mo', Date.parseMonth(value, true));
    case 'd': return this.set('date', value);
    case 'H': case 'I': return this.set('hr', value);
    case 'm': return this.set('mo', value - 1);
    case 'M': return this.set('min', value);
    case 'p': return this.set('ampm', value.replace(/\./g, ''));
    case 'S': return this.set('sec', value);
    case 's': return this.set('ms', ('0.' + value) * 1000);
    case 'w': return this.set('day', value);
    case 'Y': return this.set('year', value);
    case 'y':
      value = +value;
      if (value < 100) value += startCentury + (value < startYear ? 100 : 0);
      return this.set('year', value);
    case 'z':
      if (value == 'Z') value = '+00';
      var offset = value.match(/([+-])(\d{2}):?(\d{2})?/);
      offset = (offset[1] + '1') * (offset[2] * 60 + (+offset[3] || 0)) + this.getTimezoneOffset();
      return this.set('time', this - offset * 60000);
  }

  return this;
};

Date.defineParsers(
  '%Y([-./]%m([-./]%d((T| )%X)?)?)?', // "1999-12-31", "1999-12-31 11:59pm", "1999-12-31 23:59:59", ISO8601
  '%Y%m%d(T%H(%M%S?)?)?', // "19991231", "19991231T1159", compact
  '%x( %X)?', // "12/31", "12.31.99", "12-31-1999", "12/31/2008 11:59 PM"
  '%d%o( %b( %Y)?)?( %X)?', // "31st", "31st December", "31 Dec 1999", "31 Dec 1999 11:59pm"
  '%b( %d%o)?( %Y)?( %X)?', // Same as above with month and day switched
  '%Y %b( %d%o( %X)?)?', // Same as above with year coming first
  '%o %b %d %X %z %Y', // "Thu Oct 22 08:11:23 +0000 2009"
  '%T', // %H:%M:%S
  '%H:%M( ?%p)?' // "11:05pm", "11:05 am" and "11:05"
);

Locale.addEvent('change', function(language){
  if (Locale.get('Date')) recompile(language);
}).fireEvent('change', Locale.getCurrent());

})();

/*
---

script: Locale.Set.From.js

name: Locale.Set.From

description: Provides an alternative way to create Locale.Set objects.

license: MIT-style license

authors:
  - Tim Wienk

requires:
  - Core/JSON
  - Locale

provides: Locale.Set.From

...
*/

(function(){

var parsers = {
  'json': JSON.decode
};

Locale.Set.defineParser = function(name, fn){
  parsers[name] = fn;
};

Locale.Set.from = function(set, type){
  if (instanceOf(set, Locale.Set)) return set;

  if (!type && typeOf(set) == 'string') type = 'json';
  if (parsers[type]) set = parsers[type](set);

  var locale = new Locale.Set;

  locale.sets = set.sets || {};

  if (set.inherits){
    locale.inherits.locales = Array.from(set.inherits.locales);
    locale.inherits.sets = set.inherits.sets || {};
  }

  return locale;
};

})();

/*
---

name: Locale.en-US.Number

description: Number messages for US English.

license: MIT-style license

authors:
  - Arian Stolwijk

requires:
  - Locale

provides: [Locale.en-US.Number]

...
*/

Locale.define('en-US', 'Number', {

  decimal: '.',
  group: ',',

/* 	Commented properties are the defaults for Number.format
  decimals: 0,
  precision: 0,
  scientific: null,

  prefix: null,
  suffic: null,

  // Negative/Currency/percentage will mixin Number
  negative: {
    prefix: '-'
  },*/

  currency: {
//		decimals: 2,
    prefix: '$ '
  }/*,

  percentage: {
    decimals: 2,
    suffix: '%'
  }*/

});



/*
---

script: Array.Extras.js

name: Array.Extras

description: Extends the Array native object to include useful methods to work with arrays.

license: MIT-style license

authors:
  - Christoph Pojer
  - Sebastian Markbåge

requires:
  - Core/Array
  - MooTools.More

provides: [Array.Extras]

...
*/

(function(nil){

Array.implement({

  min: function(){
    return Math.min.apply(null, this);
  },

  max: function(){
    return Math.max.apply(null, this);
  },

  average: function(){
    return this.length ? this.sum() / this.length : 0;
  },

  sum: function(){
    var result = 0, l = this.length;
    if (l){
      while (l--){
        if (this[l] != null) result += parseFloat(this[l]);
      }
    }
    return result;
  },

  unique: function(){
    return [].combine(this);
  },

  shuffle: function(){
    for (var i = this.length; i && --i;){
      var temp = this[i], r = Math.floor(Math.random() * ( i + 1 ));
      this[i] = this[r];
      this[r] = temp;
    }
    return this;
  },

  reduce: function(fn, value){
    for (var i = 0, l = this.length; i < l; i++){
      if (i in this) value = value === nil ? this[i] : fn.call(null, value, this[i], i, this);
    }
    return value;
  },

  reduceRight: function(fn, value){
    var i = this.length;
    while (i--){
      if (i in this) value = value === nil ? this[i] : fn.call(null, value, this[i], i, this);
    }
    return value;
  },

  pluck: function(prop){
    return this.map(function(item){
      return item[prop];
    });
  }

});

})();

/*
---

script: Date.Extras.js

name: Date.Extras

description: Extends the Date native object to include extra methods (on top of those in Date.js).

license: MIT-style license

authors:
  - Aaron Newton
  - Scott Kyle

requires:
  - Date

provides: [Date.Extras]

...
*/

Date.implement({

  timeDiffInWords: function(to){
    return Date.distanceOfTimeInWords(this, to || new Date);
  },

  timeDiff: function(to, separator){
    if (to == null) to = new Date;
    var delta = ((to - this) / 1000).floor().abs();

    var vals = [],
      durations = [60, 60, 24, 365, 0],
      names = ['s', 'm', 'h', 'd', 'y'],
      value, duration;

    for (var item = 0; item < durations.length; item++){
      if (item && !delta) break;
      value = delta;
      if ((duration = durations[item])){
        value = (delta % duration);
        delta = (delta / duration).floor();
      }
      vals.unshift(value + (names[item] || ''));
    }

    return vals.join(separator || ':');
  }

}).extend({

  distanceOfTimeInWords: function(from, to){
    return Date.getTimePhrase(((to - from) / 1000).toInt());
  },

  getTimePhrase: function(delta){
    var suffix = (delta < 0) ? 'Until' : 'Ago';
    if (delta < 0) delta *= -1;

    var units = {
      minute: 60,
      hour: 60,
      day: 24,
      week: 7,
      month: 52 / 12,
      year: 12,
      eon: Infinity
    };

    var msg = 'lessThanMinute';

    for (var unit in units){
      var interval = units[unit];
      if (delta < 1.5 * interval){
        if (delta > 0.75 * interval) msg = unit;
        break;
      }
      delta /= interval;
      msg = unit + 's';
    }

    delta = delta.round();
    return Date.getMsg(msg + suffix, delta).substitute({delta: delta});
  }

}).defineParsers(

  {
    // "today", "tomorrow", "yesterday"
    re: /^(?:tod|tom|yes)/i,
    handler: function(bits){
      var d = new Date().clearTime();
      switch (bits[0]){
        case 'tom': return d.increment();
        case 'yes': return d.decrement();
        default: return d;
      }
    }
  },

  {
    // "next Wednesday", "last Thursday"
    re: /^(next|last) ([a-z]+)$/i,
    handler: function(bits){
      var d = new Date().clearTime();
      var day = d.getDay();
      var newDay = Date.parseDay(bits[2], true);
      var addDays = newDay - day;
      if (newDay <= day) addDays += 7;
      if (bits[1] == 'last') addDays -= 7;
      return d.set('date', d.getDate() + addDays);
    }
  }

).alias('timeAgoInWords', 'timeDiffInWords');

/*
---

name: Hash

description: Contains Hash Prototypes. Provides a means for overcoming the JavaScript practical impossibility of extending native Objects.

license: MIT-style license.

requires:
  - Core/Object
  - MooTools.More

provides: [Hash]

...
*/

(function(){

if (this.Hash) return;

var Hash = this.Hash = new Type('Hash', function(object){
  if (typeOf(object) == 'hash') object = Object.clone(object.getClean());
  for (var key in object) this[key] = object[key];
  return this;
});

this.$H = function(object){
  return new Hash(object);
};

Hash.implement({

  forEach: function(fn, bind){
    Object.forEach(this, fn, bind);
  },

  getClean: function(){
    var clean = {};
    for (var key in this){
      if (this.hasOwnProperty(key)) clean[key] = this[key];
    }
    return clean;
  },

  getLength: function(){
    var length = 0;
    for (var key in this){
      if (this.hasOwnProperty(key)) length++;
    }
    return length;
  }

});

Hash.alias('each', 'forEach');

Hash.implement({

  has: Object.prototype.hasOwnProperty,

  keyOf: function(value){
    return Object.keyOf(this, value);
  },

  hasValue: function(value){
    return Object.contains(this, value);
  },

  extend: function(properties){
    Hash.each(properties || {}, function(value, key){
      Hash.set(this, key, value);
    }, this);
    return this;
  },

  combine: function(properties){
    Hash.each(properties || {}, function(value, key){
      Hash.include(this, key, value);
    }, this);
    return this;
  },

  erase: function(key){
    if (this.hasOwnProperty(key)) delete this[key];
    return this;
  },

  get: function(key){
    return (this.hasOwnProperty(key)) ? this[key] : null;
  },

  set: function(key, value){
    if (!this[key] || this.hasOwnProperty(key)) this[key] = value;
    return this;
  },

  empty: function(){
    Hash.each(this, function(value, key){
      delete this[key];
    }, this);
    return this;
  },

  include: function(key, value){
    if (this[key] == undefined) this[key] = value;
    return this;
  },

  map: function(fn, bind){
    return new Hash(Object.map(this, fn, bind));
  },

  filter: function(fn, bind){
    return new Hash(Object.filter(this, fn, bind));
  },

  every: function(fn, bind){
    return Object.every(this, fn, bind);
  },

  some: function(fn, bind){
    return Object.some(this, fn, bind);
  },

  getKeys: function(){
    return Object.keys(this);
  },

  getValues: function(){
    return Object.values(this);
  },

  toQueryString: function(base){
    return Object.toQueryString(this, base);
  }

});

Hash.alias({indexOf: 'keyOf', contains: 'hasValue'});


})();


/*
---

script: Hash.Extras.js

name: Hash.Extras

description: Extends the Hash Type to include getFromPath which allows a path notation to child elements.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Hash
  - Object.Extras

provides: [Hash.Extras]

...
*/

Hash.implement({

  getFromPath: function(notation){
    return Object.getFromPath(this, notation);
  },

  cleanValues: function(method){
    return new Hash(Object.cleanValues(this, method));
  },

  run: function(){
    Object.run(arguments);
  }

});

/*
---
name: Number.Format
description: Extends the Number Type object to include a number formatting method.
license: MIT-style license
authors: [Arian Stolwijk]
requires: [Core/Number, Locale.en-US.Number]
# Number.Extras is for compatibility
provides: [Number.Format, Number.Extras]
...
*/


Number.implement({

  format: function(options){
    // Thanks dojo and YUI for some inspiration
    var value = this;
    options = options ? Object.clone(options) : {};
    var getOption = function(key){
      if (options[key] != null) return options[key];
      return Locale.get('Number.' + key);
    };

    var negative = value < 0,
      decimal = getOption('decimal'),
      precision = getOption('precision'),
      group = getOption('group'),
      decimals = getOption('decimals');

    if (negative){
      var negativeLocale = getOption('negative') || {};
      if (negativeLocale.prefix == null && negativeLocale.suffix == null) negativeLocale.prefix = '-';
      ['prefix', 'suffix'].each(function(key){
        if (negativeLocale[key]) options[key] = getOption(key) + negativeLocale[key];
      });

      value = -value;
    }

    var prefix = getOption('prefix'),
      suffix = getOption('suffix');

    if (decimals !== '' && decimals >= 0 && decimals <= 20) value = value.toFixed(decimals);
    if (precision >= 1 && precision <= 21) value = (+value).toPrecision(precision);

    value += '';
    var index;
    if (getOption('scientific') === false && value.indexOf('e') > -1){
      var match = value.split('e'),
        zeros = +match[1];
      value = match[0].replace('.', '');

      if (zeros < 0){
        zeros = -zeros - 1;
        index = match[0].indexOf('.');
        if (index > -1) zeros -= index - 1;
        while (zeros--) value = '0' + value;
        value = '0.' + value;
      } else {
        index = match[0].lastIndexOf('.');
        if (index > -1) zeros -= match[0].length - index - 1;
        while (zeros--) value += '0';
      }
    }

    if (decimal != '.') value = value.replace('.', decimal);

    if (group){
      index = value.lastIndexOf(decimal);
      index = (index > -1) ? index : value.length;
      var newOutput = value.substring(index),
        i = index;

      while (i--){
        if ((index - i - 1) % 3 == 0 && i != (index - 1)) newOutput = group + newOutput;
        newOutput = value.charAt(i) + newOutput;
      }

      value = newOutput;
    }

    if (prefix) value = prefix + value;
    if (suffix) value += suffix;

    return value;
  },

  formatCurrency: function(decimals){
    var locale = Locale.get('Number.currency') || {};
    if (locale.scientific == null) locale.scientific = false;
    locale.decimals = decimals != null ? decimals
      : (locale.decimals == null ? 2 : locale.decimals);

    return this.format(locale);
  },

  formatPercentage: function(decimals){
    var locale = Locale.get('Number.percentage') || {};
    if (locale.suffix == null) locale.suffix = '%';
    locale.decimals = decimals != null ? decimals
      : (locale.decimals == null ? 2 : locale.decimals);

    return this.format(locale);
  }

});

/*
---

script: Color.js

name: Color

description: Class for creating and manipulating colors in JavaScript. Supports HSB -> RGB Conversions and vice versa.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Array
  - Core/String
  - Core/Number
  - Core/Hash
  - Core/Function
  - MooTools.More

provides: [Color]

...
*/

(function(){

var Color = this.Color = new Type('Color', function(color, type){
  if (arguments.length >= 3){
    type = 'rgb'; color = Array.slice(arguments, 0, 3);
  } else if (typeof color == 'string'){
    if (color.match(/rgb/)) color = color.rgbToHex().hexToRgb(true);
    else if (color.match(/hsb/)) color = color.hsbToRgb();
    else color = color.hexToRgb(true);
  }
  type = type || 'rgb';
  switch (type){
    case 'hsb':
      var old = color;
      color = color.hsbToRgb();
      color.hsb = old;
    break;
    case 'hex': color = color.hexToRgb(true); break;
  }
  color.rgb = color.slice(0, 3);
  color.hsb = color.hsb || color.rgbToHsb();
  color.hex = color.rgbToHex();
  return Object.append(color, this);
});

Color.implement({

  mix: function(){
    var colors = Array.slice(arguments);
    var alpha = (typeOf(colors.getLast()) == 'number') ? colors.pop() : 50;
    var rgb = this.slice();
    colors.each(function(color){
      color = new Color(color);
      for (var i = 0; i < 3; i++) rgb[i] = Math.round((rgb[i] / 100 * (100 - alpha)) + (color[i] / 100 * alpha));
    });
    return new Color(rgb, 'rgb');
  },

  invert: function(){
    return new Color(this.map(function(value){
      return 255 - value;
    }));
  },

  setHue: function(value){
    return new Color([value, this.hsb[1], this.hsb[2]], 'hsb');
  },

  setSaturation: function(percent){
    return new Color([this.hsb[0], percent, this.hsb[2]], 'hsb');
  },

  setBrightness: function(percent){
    return new Color([this.hsb[0], this.hsb[1], percent], 'hsb');
  }

});

this.$RGB = function(r, g, b){
  return new Color([r, g, b], 'rgb');
};

this.$HSB = function(h, s, b){
  return new Color([h, s, b], 'hsb');
};

this.$HEX = function(hex){
  return new Color(hex, 'hex');
};

Array.implement({

  rgbToHsb: function(){
    var red = this[0],
        green = this[1],
        blue = this[2],
        hue = 0;
    var max = Math.max(red, green, blue),
        min = Math.min(red, green, blue);
    var delta = max - min;
    var brightness = max / 255,
        saturation = (max != 0) ? delta / max : 0;
    if (saturation != 0){
      var rr = (max - red) / delta;
      var gr = (max - green) / delta;
      var br = (max - blue) / delta;
      if (red == max) hue = br - gr;
      else if (green == max) hue = 2 + rr - br;
      else hue = 4 + gr - rr;
      hue /= 6;
      if (hue < 0) hue++;
    }
    return [Math.round(hue * 360), Math.round(saturation * 100), Math.round(brightness * 100)];
  },

  hsbToRgb: function(){
    var br = Math.round(this[2] / 100 * 255);
    if (this[1] == 0){
      return [br, br, br];
    } else {
      var hue = this[0] % 360;
      var f = hue % 60;
      var p = Math.round((this[2] * (100 - this[1])) / 10000 * 255);
      var q = Math.round((this[2] * (6000 - this[1] * f)) / 600000 * 255);
      var t = Math.round((this[2] * (6000 - this[1] * (60 - f))) / 600000 * 255);
      switch (Math.floor(hue / 60)){
        case 0: return [br, t, p];
        case 1: return [q, br, p];
        case 2: return [p, br, t];
        case 3: return [p, q, br];
        case 4: return [t, p, br];
        case 5: return [br, p, q];
      }
    }
    return false;
  }

});

String.implement({

  rgbToHsb: function(){
    var rgb = this.match(/\d{1,3}/g);
    return (rgb) ? rgb.rgbToHsb() : null;
  },

  hsbToRgb: function(){
    var hsb = this.match(/\d{1,3}/g);
    return (hsb) ? hsb.hsbToRgb() : null;
  }

});

})();


/*
---

script: Group.js

name: Group

description: Class for monitoring collections of events

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Events
  - MooTools.More

provides: [Group]

...
*/

(function(){

this.Group = new Class({

  initialize: function(){
    this.instances = Array.flatten(arguments);
  },

  addEvent: function(type, fn){
    var instances = this.instances,
      len = instances.length,
      togo = len,
      args = new Array(len),
      self = this;

    instances.each(function(instance, i){
      instance.addEvent(type, function(){
        if (!args[i]) togo--;
        args[i] = arguments;
        if (!togo){
          fn.call(self, instances, instance, args);
          togo = len;
          args = new Array(len);
        }
      });
    });
  }

});

})();
