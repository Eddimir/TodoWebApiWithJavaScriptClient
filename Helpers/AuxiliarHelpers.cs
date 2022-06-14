using TodoWebApi.Models;

namespace TodoWebApi.Helpers
{
    public static class AuxiliarHelper
    {
        public static TodoItemDTO ItemToDTO(TodoItem todoItem) =>
                 new TodoItemDTO
                 {
                     Id = todoItem.Id,
                     Name = todoItem.Name,
                     IsComplete = todoItem.IsComplete
                 };
    }
}