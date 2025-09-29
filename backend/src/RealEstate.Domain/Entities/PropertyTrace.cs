using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RealEstate.Domain.Entities;


public class PropertyTrace
{
    [BsonId]
    public ObjectId IdPropertyTrace { get; set; }

    [BsonElement("idProperty")]
    public ObjectId IdProperty { get; set; }

    [BsonElement("dateSale")]
    public DateTime DateSale { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = default!;

    [BsonElement("value")]
    public decimal Value { get; set; }

    [BsonElement("tax")]
    public decimal Tax { get; set; }
    
}
