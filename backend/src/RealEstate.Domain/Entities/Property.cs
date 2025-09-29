using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RealEstate.Domain.Entities;

public class Property
{
    [BsonId]
    public ObjectId Id { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = default!;

    [BsonElement("address")]
    public string Address { get; set; } = default!;

    [BsonElement("price")]
    public decimal Price { get; set; }

    [BsonElement("codeInternal")]
    public string CodeInternal { get; set; } = default!;

    [BsonElement("year")]
    public int Year { get; set; }

    [BsonElement("idOwner")]
    public ObjectId IdOwner { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; }
}

