using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RealEstate.Domain.Entities;


public class Owner
{
    [BsonId]
    public ObjectId IdOwner { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = default!;

    [BsonElement("address")]
    public string Address { get; set; } = default!;

    [BsonElement("photo")]
    public string? Photo { get; set; }

    [BsonElement("birthday")]
    public DateTime? Birthday { get; set; }

}