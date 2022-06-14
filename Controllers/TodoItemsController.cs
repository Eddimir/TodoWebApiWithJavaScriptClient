using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using TodoWebApi.Models;
using TodoWebApi.Repository;

namespace TodoWebApi.Controllers
{
    [Route("api/TodoItems")]
    [ApiController]
    public class TodoItemsController : ControllerBase
    {
        private readonly ITodoRepository _repository;

        public TodoItemsController(ITodoRepository repository) => _repository = repository;
        // GET: api/TodoItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoItemDTO>>> GetTodoItems()
        {
            return await _repository.GetList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItemDTO>> GetTodoItem(long id)
        {
            var todoItem = await _repository.GetById(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            return Helpers.AuxiliarHelper.ItemToDTO(todoItem);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTodoItem(long id, TodoItemDTO todoItemDTO)
        {
            if (id != todoItemDTO.Id)
            {
                return BadRequest();
            }

            var todoItem = await _repository.GetById(id);
            if (todoItem == null)
            {
                return NotFound();
            }

            todoItem.Name = todoItemDTO.Name;
            todoItem.IsComplete = todoItemDTO.IsComplete;

            try
            {
                await _repository.CompleteAsync();
            }
            catch (DbUpdateConcurrencyException) when (!_repository.Exist(id))
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<TodoItemDTO>> CreateTodoItem(TodoItemDTO todoItemDTO)
        {
            _repository.Add(todoItemDTO);
            await _repository.CompleteAsync();

            return CreatedAtAction(  
              nameof(GetTodoItem),
              new { id = todoItemDTO.Id },
              todoItemDTO);          
        }
       
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoItem(long id)
        {
            var todoItem = await _repository.GetById(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            _repository.Delete(todoItem);
            await _repository.CompleteAsync();

            return NoContent();
        }
    }
}
