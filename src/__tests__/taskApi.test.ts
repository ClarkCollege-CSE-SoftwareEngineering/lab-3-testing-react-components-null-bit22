import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchTasks, createTask, deleteTask, toggleTask } from '../api/taskApi';

describe('taskApi', () => {
  // Store the original fetch
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = vi.fn();
  });

  afterEach(() => {
    // Restore original fetch after tests
    global.fetch = originalFetch;
  });

  describe('fetchTasks', () => {
    it('returns tasks on successful response', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', completed: false },
        { id: '2', title: 'Task 2', completed: true },
      ];

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTasks),
      } as Response);

      const result = await fetchTasks();

      expect(result).toEqual(mockTasks);
      expect(global.fetch).toHaveBeenCalledWith('/api/tasks');
    });

    it('throws error on failed response', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      await expect(fetchTasks()).rejects.toThrow('Failed to fetch tasks');
    });
  });

  // TODO: Add tests for createTask
  describe('createTasks', () => {
  // - Test successful creation (mock POST request, verify body and headers)
    it('creates task successfully', async () => {
      const newTask = {title: 'Learn React'};
      const mockTask = {id: '1', title: 'Learn React', completed: false};

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTask),
      } as Response);

      const result = await createTask(newTask);

      expect(result).toEqual(mockTask);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/tasks',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask)
        }
      );
    });

  // - Test error handling
    it('throws error on failed task creation', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      await expect(createTask({title: "Learn React in 1 day"})).rejects.toThrow('Failed to create task'); 
    })
  });

  // TODO: Add tests for deleteTask
  describe('deleteTask', () => {
  // - Test successful deletion (mock DELETE request)
    it('successfully deletes a task item', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
      } as Response);

      await deleteTask('Learn-React');

      expect(global.fetch).toBeCalledWith(
        '/api/tasks/Learn-React',
        { method: 'DELETE' }
      );
    })
  
  // - Test error handling
    it('throws error on invalid delete', async () => {
        vi.mocked(global.fetch).mockResolvedValue({
            ok: false,
        } as Response);

        await expect(deleteTask('Bad Task')).rejects.toThrow('Failed to delete task');
    });
  });

  // TODO: Add tests for toggleTask
  describe('toggleTask', () => {
  // - Test successful toggle (mock PATCH request, verify body
    it('successfully toggles a task', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ completed: true })
      } as Response);

      await toggleTask('Learn-React', true);

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/tasks/Learn-React',
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: true })
        }
      );
    }) 
  // - Test error handling
    it('throws error on invalid toggle', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
          ok: false,
      } as Response);

      await expect(toggleTask('Task1', true)).rejects.toThrow('Failed to update task');
    }) 
  })
});