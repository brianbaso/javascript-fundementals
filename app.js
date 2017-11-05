/*global jQuery, Handlebars, Router */
jQuery(function ($) {
	// write "secure" js, previous bad syntax becomes real errors
	'use strict';

	// compare the filter to all, active, completed to choose which one is selected
	Handlebars.registerHelper('eq', function (a, b, options) {
		// if filter === all run template 1, else run template 2 (template 2 does not exist here)
		return a === b ? options.fn(this) : options.inverse(this);
	});

	// constants for more understandable code
	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;
  	

	var util = {
		// create a random key for data points
		uuid: function () {
			/*jshint bitwise:false */
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
			}

			return uuid;
		},
		// make "item" plural when necessary
		pluralize: function (count, word) {
			return count === 1 ? word : word + 's';
		},
		store: function (namespace, data) {
			if (arguments.length > 1) {
				// store item in local storage as a string
				return localStorage.setItem(namespace, JSON.stringify(data));
			} else {
				// get item from local storage and parse the string into object
				var store = localStorage.getItem(namespace);
				return (store && JSON.parse(store)) || [];
			}
		}
	};

	var App = {
		init: function () {
			// check the local storage for any todos
			this.todos = util.store('todos-jquery');
			// use templating to create the todo list and footer
			this.todoTemplate = Handlebars.compile($('#todo-template').html());
			this.footerTemplate = Handlebars.compile($('#footer-template').html());
			// bind all the event listeners to the app
			this.bindEvents();

			// sync the url with the todos that will be shown 
			new Router({
				'/:filter': function (filter) {
					this.filter = filter;
					this.render();
				}.bind(this)
				// start with 'all' filter
			}).init('/all');
		},
		bindEvents: function () {
			// create new todo if a key is pressed on the new-todo element
			$('#new-todo').on('keyup', this.create.bind(this));
			// trigger toggle all method when the boolean changes on toggle-all
			$('#toggle-all').on('change', this.toggleAll.bind(this));
			// run destroyCompleted method when clear-completed button is clicked
			$('#footer').on('click', '#clear-completed', this.destroyCompleted.bind(this));
			$('#todo-list')
				// when toggle's 'completed' boolean is changed, run toggle method
				.on('change', '.toggle', this.toggle.bind(this))
				// run edit on a double click
				.on('dblclick', 'label', this.edit.bind(this))
				// check if the keyup was escape or enter key
				.on('keyup', '.edit', this.editKeyup.bind(this))
				// when cursor is no longer in the element, run update method
				.on('focusout', '.edit', this.update.bind(this))
				// delete when clicked
				.on('click', '.destroy', this.destroy.bind(this));
		},
		render: function () {
			// choose which todos to render
			var todos = this.getFilteredTodos();
			// use handlebars to render todoTemplate with todos
			$('#todo-list').html(this.todoTemplate(todos));
			// if todos are present, toggle main element
			$('#main').toggle(todos.length > 0);
			// if toggle all element is checked, no active todos
			$('#toggle-all').prop('checked', this.getActiveTodos().length === 0);
			this.renderFooter();
			// if new todo element is clicked, place cursor inside
			$('#new-todo').focus();
			// save the todos into local storage
			util.store('todos-jquery', this.todos);
		},
		renderFooter: function () {
			// display todo count bottom left in footer
			var todoCount = this.todos.length;
			// look for amount of active todos
			var activeTodoCount = this.getActiveTodos().length;
			var template = this.footerTemplate({
				// shows how many active items are left
				activeTodoCount: activeTodoCount,
				// pluralize item if necessary
				activeTodoWord: util.pluralize(activeTodoCount, 'item'),
				// shows clear completed button if > 0
				completedTodos: todoCount - activeTodoCount,
				// decide which filter currently on
				filter: this.filter
			});
			// toggle filter if any todos
			$('#footer').toggle(todoCount > 0).html(template);
		},
		toggleAll: function (e) {
			// check boolean on toggle all element
			var isChecked = $(e.target).prop('checked');
			// change todos to whatever isChecked returns
			this.todos.forEach(function (todo) {
				todo.completed = isChecked;
			});

			this.render();
		},
		// iterate through todo and return what is or isnt completed
		getActiveTodos: function () {
			return this.todos.filter(function (todo) {
				return !todo.completed;
			});
		},
		getCompletedTodos: function () {
			return this.todos.filter(function (todo) {
				return todo.completed;
			});
		},
		// decide which todos to display
		getFilteredTodos: function () {
			if (this.filter === 'active') {
				return this.getActiveTodos();
			}

			if (this.filter === 'completed') {
				return this.getCompletedTodos();
			}

			return this.todos;
		},
		destroyCompleted: function () {
			// remove completed todos by setting all todos to only active todos
			this.todos = this.getActiveTodos();
			// switch filter back to all
			this.filter = 'all';
			this.render();
		},
		// accepts an element from inside the `.item` div and
		// returns the corresponding index in the `todos` array
		indexFromEl: function (el) {
			// get the index of the element, .closest .data are jquery functions
			var id = $(el).closest('li').data('id');
			var todos = this.todos;
			var i = todos.length;

			// iterate through the loop until the id matches var id above
			while (i--) {
				if (todos[i].id === id) {
					return i;
				}
			}
		},
		create: function (e) {
			// grab the input
			var $input = $(e.target);
			// trim the input value
			var val = $input.val().trim();
			// do not continue if enter key is pressed
			if (e.which !== ENTER_KEY || !val) {
				return;
			}
			// if not enter key then create new todo in array
			this.todos.push({
				id: util.uuid(),
				title: val,
				completed: false
			});
			// reset the input value
			$input.val('');

			this.render();
		},
		// toggle between active and completed
		toggle: function (e) {
			var i = this.indexFromEl(e.target);
			this.todos[i].completed = !this.todos[i].completed;
			this.render();
		},
		edit: function (e) {
			// if the element is clicked then give it the edit class and change its value
			var $input = $(e.target).closest('li').addClass('editing').find('.edit');
			// add cursor inside the val
			$input.val($input.val()).focus();
		},
		editKeyup: function (e) {
			// remove focus if enter is pressed
			if (e.which === ENTER_KEY) {
				e.target.blur();
			}
			// remove focus if esc is pressed and cancel changes
			if (e.which === ESCAPE_KEY) {
				$(e.target).data('abort', true).blur();
			}
		},
		update: function (e) {
			// grab the typed value and trim it
			var el = e.target;
			var $el = $(el);
			var val = $el.val().trim();
			// if typed value is NULL then delete 
			if (!val) {
				this.destroy(e);
				return;
			}
			// if escape is pressed then cancel changes
			if ($el.data('abort')) {
				$el.data('abort', false);
			} else {
				// set new todo to the value typed
				this.todos[this.indexFromEl(el)].title = val;
			}

			this.render();
		},
		destroy: function (e) {
			// delete one todo at the index location
			this.todos.splice(this.indexFromEl(e.target), 1);
			this.render();
		}
	};
	// run app
	App.init();
});