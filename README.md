# Todo CLI TUI

A modern, keyboard-driven Terminal User Interface (TUI) for managing todo tasks. Built with Python and the Textual framework.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Python](https://img.shields.io/badge/python-3.13+-green)
![License](https://img.shields.io/badge/license-MIT-orange)

## Features

### Core Functionality (User Stories 1, 2, & 3)

- ✅ **Add Tasks** - Create new tasks with descriptions
- ✅ **List Tasks** - View all tasks with completion status
- ✅ **Edit Tasks** - Modify existing task descriptions
- ✅ **Delete Tasks** - Remove tasks from your list
- ✅ **Toggle Completion** - Mark tasks as complete/incomplete with Space key
- ✅ **Keyboard Navigation** - Full keyboard support, no mouse required
- ✅ **Input Validation** - Prevents empty task descriptions
- ✅ **Empty List Handling** - Graceful handling when no tasks exist

## Installation

### Prerequisites

- Python 3.13 or higher
- [UV](https://github.com/astral-sh/uv) package manager

### Setup

1. Clone the repository:
```bash
git clone https://github.com/misha-jatt/Todo-hackathon-II
cd TODO-HACKATHON-II
```

2. Install dependencies:
```bash
uv sync
```

## Running the Application

Start the Todo CLI application:

```bash
uv run python cli/main.py
```

## Usage

### Main Menu Navigation

The main menu provides 5 options:

1. **Add Task** - Create a new todo item
2. **List Tasks** - View all your tasks
3. **Edit Task** - Modify an existing task description
4. **Delete Task** - Remove a task from your list
5. **Exit** - Quit the application

### Keyboard Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| ↑↓ | Navigate | Main menu, task lists |
| Enter | Select/Confirm | All screens |
| Space | Toggle completion | Task list screen |
| Esc | Cancel/Return | All screens |

### Adding Tasks

1. Select **Add Task** from the main menu
2. Enter your task description
3. Press **Enter** to save or **Esc** to cancel

### Listing Tasks

1. Select **List Tasks** from the main menu
2. View all tasks with their completion status:
   - `[ ]` = Uncompleted task
   - `[x]` = Completed task
3. Use **Space** to toggle task completion
4. Press **Enter** to return to the main menu

### Editing Tasks

1. Select **Edit Task** from the main menu
2. Use **arrow keys** to select a task
3. Enter a new description
4. Press **Enter** to save or **Esc** to cancel

### Deleting Tasks

1. Select **Delete Task** from the main menu
2. Use **arrow keys** to select a task
3. Press **Enter** or **D** to delete, or **Esc** to cancel

## Project Structure

```
todo-list-hackathon/
├── cli/
│   ├── __init__.py
│   ├── main.py                 # Application entry point
│   ├── models/
│   │   ├── __init__.py
│   │   └── task.py             # Task dataclass
│   ├── services/
│   │   ├── __init__.py
│   │   └── task_service.py     # Task CRUD operations
│   └── ui/
│       ├── __init__.py
│       ├── main_menu.py        # Main menu screen
│       ├── add_task.py         # Add task screen
│       ├── task_list.py        # Task list screen
│       ├── edit_task.py        # Edit task screen
│       └── delete_task.py      # Delete task screen
├── tests/
│   └── unit/
│       ├── test_task_model.py      # Task model tests
│       └── test_task_service.py    # TaskService tests
├── specs/
│   └── 001-todo-cli-tui/
│       ├── spec.md            # Feature specification
│       ├── plan.md            # Implementation plan
│       ├── tasks.md           # Implementation tasks
│       └── ...
├── pyproject.toml             # Project configuration
└── README.md                  # This file
```

## Running Tests

The project uses pytest for testing. Run the test suite:

```bash
# Run all unit tests
uv run pytest tests/unit/ -v

# Run with coverage
uv run pytest --cov=cli --cov-report=html

# Run specific test file
uv run pytest tests/unit/test_task_model.py -v
```

### Test Coverage

- ✅ 17 tests for Task model (validation, toggle, immutability)
- ✅ 23 tests for TaskService (CRUD operations, edge cases)
- 🎯 100% coverage for models and services
- 📊 40 total unit tests (all passing)

## Technology Stack

- **Python 3.13+** - Modern Python with type hints
- **Textual 0.80+** - TUI framework for terminal interfaces
- **pytest** - Testing framework
- **UV** - Fast Python package manager

## Design Principles

### Architecture

- **Separation of Concerns** - Models, services, and UI are cleanly separated
- **Immutable Data** - Task model uses frozen dataclass for safety
- **Service Layer** - Business logic isolated in TaskService
- **Screen Stack** - Navigation using push/pop pattern

### Code Quality

- **Type Hints** - Full type annotations throughout
- **Input Validation** - Comprehensive validation at model and service layers
- **Error Handling** - Graceful error handling with user-friendly messages
- **Testing** - TDD approach with high test coverage

## Development

### Adding New Features

1. Update `specs/001-todo-cli-tui/spec.md` with requirements
2. Run `/sp.plan` to create implementation plan
3. Run `/sp.tasks` to generate actionable tasks
4. Implement following TDD: tests first, then code
5. Update README.md with new features

### Code Style

The project follows these conventions:
- Frozen dataclasses for immutable models
- Async-first design with Textual framework
- Keyboard-driven UI with screen stack navigation
- Comprehensive validation and error handling

## Limitations

- **In-Memory Storage** - Tasks are stored in memory only (no persistence)
- **Single Session** - Data is lost when application exits
- **No Multi-Tasking** - One task at a time (no concurrent task management)

## Future Enhancements

Potential features for future versions:
- 📁 Persistent storage (JSON, SQLite)
- 🏷️ Task categories/tags
- 📅 Due dates and reminders
- 🔍 Search and filter tasks
- 📤 Export tasks to various formats
- 🎨 Enhanced visual themes
- ⌨️ Custom keyboard shortcuts

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Acknowledgments

Built with:
- [Textual](https://textual.textualize.io/) - Modern TUI framework for Python
- [UV](https://github.com/astral-sh/uv) - Fast Python package manager
- [pytest](https://docs.pytest.org/) - Testing framework

---

**Version:** 1.0.0
**Status:** Production Ready ✅
**Last Updated:** January 2026
