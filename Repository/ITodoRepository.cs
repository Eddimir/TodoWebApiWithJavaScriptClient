using TodoWebApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TodoWebApi.Repository
{
    public interface ITodoRepository
    {
        void Add(TodoItemDTO todo);
        void Delete(TodoItem todoitem);
        Task<List<TodoItemDTO>> GetList();
        bool Exist(long id);
        Task<TodoItem> GetById(long id);
        Task CompleteAsync();
    }
}