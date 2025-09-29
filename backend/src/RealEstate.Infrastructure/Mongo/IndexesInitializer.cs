using MongoDB.Driver;
using RealEstate.Domain.Entities;

namespace RealEstate.Infrastructure.Mongo;

public class IndexesInitializer
{
    private readonly MongoContext _ctx;
    public IndexesInitializer(MongoContext ctx) => _ctx = ctx;

    public async Task EnsureAsync(CancellationToken ct)
    {
        await _ctx.Properties.Indexes.CreateManyAsync(new[]
        {
            new CreateIndexModel<Property>(Builders<Property>.IndexKeys.Ascending(x => x.Name)),
            new CreateIndexModel<Property>(Builders<Property>.IndexKeys.Ascending(x => x.Address)),
            new CreateIndexModel<Property>(Builders<Property>.IndexKeys.Ascending(x => x.Price)),
            new CreateIndexModel<Property>(Builders<Property>.IndexKeys.Ascending(x => x.IdOwner)),
            new CreateIndexModel<Property>(Builders<Property>.IndexKeys.Ascending(x => x.CodeInternal)),
            new CreateIndexModel<Property>(Builders<Property>.IndexKeys.Ascending(x => x.Year))
        }, cancellationToken: ct);

        // Owner
        await _ctx.Owners.Indexes.CreateOneAsync(
            new CreateIndexModel<Owner>(Builders<Owner>.IndexKeys.Ascending(x => x.Name)),
            cancellationToken: ct);

        // PropertyImage
        await _ctx.PropertyImages.Indexes.CreateManyAsync(new[]
        {
            new CreateIndexModel<PropertyImage>(Builders<PropertyImage>.IndexKeys.Ascending(x => x.IdProperty)),
            new CreateIndexModel<PropertyImage>(Builders<PropertyImage>.IndexKeys.Ascending(x => x.Enabled))
        }, cancellationToken: ct);

        // PropertyTrace
        await _ctx.PropertyTraces.Indexes.CreateManyAsync(new[]
        {
            new CreateIndexModel<PropertyTrace>(Builders<PropertyTrace>.IndexKeys.Ascending(x => x.IdProperty)),
            new CreateIndexModel<PropertyTrace>(Builders<PropertyTrace>.IndexKeys.Descending(x => x.DateSale))
        }, cancellationToken: ct);
    }
}
