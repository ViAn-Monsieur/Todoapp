using System.Text.Json.Serialization;

public class TodoItem
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public string? Deadline { get; set; }
    public int Priority { get; set; } // 0: Low, 1: Medium, 2: High
    public bool Done { get; set; } = false;

    [JsonIgnore] // 👈 Bỏ qua khi nhận JSON từ client
    public string User { get; set; } = string.Empty;
}
