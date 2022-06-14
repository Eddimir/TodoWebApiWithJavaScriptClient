using System.Collections.Generic;
using System.Threading.Tasks;
using TodoApi.Models;
using TodoWebApi.Models;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
namespace TodoWebApi.Repository
{
    public class TodoRepository:ITodoRepository
    {
        private readonly TodoContext _context;
        public TodoRepository(TodoContext context)
        {
            _context = context;
        }

        public void Add(TodoItemDTO todoItemDTO)
        {
            var todoItem = new TodoItem
            {
                IsComplete = todoItemDTO.IsComplete,
                Name = todoItemDTO.Name
            };

            _context.TodoItems.Add(todoItem);
            ///GEtting id by reference 
            todoItemDTO.Id = todoItem.Id;
        }

        public void Delete(TodoItem todoItem)
        {
            _context.Remove(todoItem);
        }

        public bool Exist(long id)
        {
            return _context.TodoItems.Any(e => e.Id == id);
        }
        public async Task<TodoItem> GetById(long id)
        {
            return  await _context.TodoItems.FindAsync(id);
        }

        public async Task<List<TodoItemDTO>> GetList()
        {
           return await _context.TodoItems
                 .Select(x => Helpers.AuxiliarHelper.ItemToDTO(x))
                 .ToListAsync();
        }

        public async Task CompleteAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}