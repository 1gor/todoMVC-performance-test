var numberOfItemsToAdd = 100;
var Suites = [];

function addItems(newTodo, contentWindow) {
  var appView = contentWindow.appView;
  for (var i = 0; i < numberOfItemsToAdd; i++) {
    var inputEvent = document.createEvent('Event');
    inputEvent.initEvent('input', true, true);
    newTodo.value = 'Something to do ' + i;
    newTodo.dispatchEvent(inputEvent);

    var keydownEvent = document.createEvent('Event');
    keydownEvent.initEvent('keydown', true, true);
    keydownEvent.which = 13;
    keydownEvent.keyCode = 13;
    keydownEvent.charCode = 13;
    newTodo.dispatchEvent(keydownEvent);

    var keyupEvent = new KeyboardEvent("keyup",{
      "key": "Enter"
    });
    newTodo.dispatchEvent(keyupEvent);

    var keypressEvent = document.createEvent('Event');
    keypressEvent.initEvent('keypress', true, true);
    keypressEvent.keyCode = 13;
    keypressEvent.charCode = 13;
    keypressEvent.which = 13;
    newTodo.dispatchEvent(keypressEvent)

    var keypressEvent2 = new KeyboardEvent("keypress",{
      "key": "Enter"
    });
    newTodo.dispatchEvent(keypressEvent2);

    if(newTodo.form) {
      var changeEvent = document.createEvent('Event');
      changeEvent.initEvent('change', true, true);
      changeEvent.value = 'Something to do ' + i;
      newTodo.value = 'Something to do ' + i;
      newTodo.dispatchEvent(changeEvent);

      var submitEvent = document.createEvent('Event');
      submitEvent.initEvent('submit', true, true);
      newTodo.form.dispatchEvent(submitEvent);
    }
  }
}

function generalTests() {
  return [
    new BenchmarkTestStep('Adding items', function (newTodo, contentWindow, contentDocument) {
      addItems(newTodo, contentWindow);
      return atLeast(contentDocument, '.toggle', numberOfItemsToAdd);
    }),
    new BenchmarkTestStep('Completing all items', function (newTodo, contentWindow, contentDocument) {
      var checkboxes = contentDocument.querySelectorAll('.toggle');
      for (var i = 0; i < checkboxes.length; i++)
      checkboxes[i].click();

      return atLeast(contentDocument, '.toggle:checked', numberOfItemsToAdd);
    }),
    new BenchmarkTestStep('Changing View', function (newTodo, contentWindow, contentDocument) {
      contentDocument.querySelectorAll('#filters a, .filters a')[1].click();

      return atMost(contentDocument, '.toggle', numberOfItemsToAdd);
    }),
    new BenchmarkTestStep('Changing View back', function (newTodo, contentWindow, contentDocument) {
      contentDocument.querySelectorAll('#filters a, .filters a')[0].click();

      return atLeast(contentDocument, '.toggle', numberOfItemsToAdd);
    }),
    new BenchmarkTestStep('Deleting all items', function (newTodo, contentWindow, contentDocument) {
      var deleteButtons = contentDocument.querySelectorAll('.destroy');
      for (var i = 0; i < deleteButtons.length; i++)
      deleteButtons[i].click();

      return atMost(contentDocument, '.toggle', 1);
    })
  ];
}

Suites.push({
  name: 'Backbone',
  url: 'todomvc/backbone/index.html',
  version: '1.1.2',
  prepare: function (runner, contentWindow, contentDocument) {
    contentWindow.Backbone.sync = function () {}
    return runner.waitForElement('#new-todo').then(function (element) {
      element.focus();
      return element;
    });
  },
  tests: generalTests()
});

Suites.push({
  name: 'FiberJS',
  url: 'todomvc/fiberjs/index.html',
  version: '0.1.0',
  prepare: function (runner, contentWindow, contentDocument) {
    return runner.waitForElement('#new-todo').then(function (element) {
      element.focus();
      return element;
    });
  },
  tests: generalTests()
});

Suites.push({
  name: 'Angular 2',
  url: 'todomvc/angular2/index.html',
  version: '2.0',
  prepare: function (runner, contentWindow, contentDocument) {
    return runner.waitForElement('.new-todo').then(function (element) {
      element.focus();
      return element;
    });
  },
  tests: generalTests()
});

Suites.push({
  name: 'Alkali',
  url: 'todomvc/alkali/index.html',
  version: '0.10.2',
  prepare: function (runner, contentWindow, contentDocument) {
    return runner.waitForElement('#new-todo').then(function (element) {
      element.focus();
      return element;
    });
  },
  tests: generalTests()
});

Suites.push({
  name: 'React',
  url: 'todomvc/react/index.html',
  version: '0.10.0',
  prepare: function (runner, contentWindow, contentDocument) {
    contentWindow.Utils.store = function () {}
    return runner.waitForElement('#new-todo').then(function (element) {
      element.focus();
      return element;
    });
  },
  tests: generalTests()
});

Suites.push({
  name: 'React+Redux',
  url: 'todomvc/redux/index.html',
  version: '(15.5 + 3.5.2)',
  prepare: function (runner, contentWindow, contentDocument) {
    return runner.waitForElement('.new-todo').then(function (element) {
      element.focus();
      return element;
    });
  },
  tests: generalTests()
});


Suites.push({
  name: 'Mercury',
  url: 'todomvc/mercury/index.html',
  version: '3.1.7 + virtual-dom 0.8',
  prepare: function (runner, contentWindow, contentDocument) {
    return runner.waitForElement('#new-todo').then(function (element) {
      element.focus();
      return element;
    });
  },
  tests: generalTests()
});

Suites.push({
  name: 'Elm',
  url: 'todomvc/elm/index.html',
  version: '0.12.3 + virtual-dom 0.8',
  prepare: function (runner, contentWindow, contentDocument) {
    return runner.waitForElement('#new-todo').then(function (element) {
      element.focus();
      return element;
    });
  },
  tests: generalTests()
});

// Suites.push({
//   name: 'Elm Incremental Dom',
//   url: 'todomvc/elm-incremental/index.html',
//   version: '0.12.3 + virtual-dom 0.8',
//   prepare: function (runner, contentWindow, contentDocument) {
//     return runner.waitForElement('#new-todo').then(function (element) {
//       element.focus();
//       return element;
//     });
//   },
//   tests: generalTests()
// });

function atLeast(contentDocument, q, number) {
  return function() {
    return contentDocument.querySelectorAll(q).length >= number;
  }
}
function atMost(contentDocument, q, number) {
  return function() {
    return contentDocument.querySelectorAll(q).length <= number;
  }
}
