using Microsoft.Extensions.Options;
using MongoDB.Driver;
using RealEstate.Domain.Entities;

namespace RealEstate.Infrastructure.Mongo;

public class MongoContext
{
    private readonly IMongoDatabase _db;

    public MongoContext(IOptions<MongoOptions> opt)
    {
        var client = new MongoClient(opt.Value.ConnectionString);
        _db = client.GetDatabase(opt.Value.Database);
    }

    public IMongoCollection<Property> Properties => _db.GetCollection<Property>("properties");
    public IMongoCollection<Owner> Owners => _db.GetCollection<Owner>("owners");
    public IMongoCollection<PropertyImage> PropertyImages => _db.GetCollection<PropertyImage>("property_images");
    public IMongoCollection<PropertyTrace> PropertyTraces => _db.GetCollection<PropertyTrace>("property_traces");
}
