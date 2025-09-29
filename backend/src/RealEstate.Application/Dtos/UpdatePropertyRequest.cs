using MongoDB.Bson;

public class UpdatePropertyRequest
{
    public string IdOwner { get; set; }
    public string Name { get; set; } = default!;
    public string Address { get; set; } = default!;
    public decimal Price { get; set; }
    public string CodeInternal { get; set; } = default!;
    public int Year { get; set; }
    public string? ImageUrl { get; set; }
}