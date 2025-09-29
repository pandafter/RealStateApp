using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace RealEstate.Domain.Entities;

public class PropertyImage
{
    [BsonId]
    public ObjectId IdPropertyImage { get; set; }

    [BsonElement("idProperty")]
    public ObjectId IdProperty { get; set; }

    [BsonElement("file")]
    public string File { get; set; } = default!;

    [BsonElement("enabled")]
    public bool Enabled { get; set; } = true;

}