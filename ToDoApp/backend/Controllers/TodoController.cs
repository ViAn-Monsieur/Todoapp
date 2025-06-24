using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;

namespace ToDoApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TodoController : ControllerBase
    {
        private static List<TodoItem> todos = new();
        private static int idCounter = 1;

        // Lấy danh sách todos theo user
        [HttpGet]
        public IActionResult Get()
        {
            var userTodos = todos.Where(t => t.User == User.Identity?.Name);
            return Ok(userTodos);
        }

        // Tạo một todo mới
        [HttpPost]
        public IActionResult Post([FromBody] TodoItem item)
        {
            if (string.IsNullOrWhiteSpace(item.Text))
                return BadRequest("Text is required");

            item.Id = idCounter++;
            item.User = User.Identity?.Name!;
            todos.Add(item);
            return Ok(item);
        }

        // Cập nhật trạng thái "done"
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] TodoItem update)
        {
            var todo = todos.FirstOrDefault(t => t.Id == id && t.User == User.Identity?.Name);
            if (todo == null) return NotFound();

            todo.Done = update.Done;
            return Ok(todo);
        }

        // Xoá todo
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var todo = todos.FirstOrDefault(t => t.Id == id && t.User == User.Identity?.Name);
            if (todo == null) return NotFound();

            todos.Remove(todo);
            return Ok();
        }
    }
}
