using MongoDB.Bson;
using MongoDB.Driver;
using RealEstate.Domain.Entities;
using RealEstate.Infrastructure.Mongo;

namespace RealEstate.Infrastructure.Repositories;

public class PropertyRepository : IPropertyRepository
{
    private readonly MongoContext _ctx;
    public PropertyRepository(MongoContext ctx) => _ctx = ctx;

    public async Task<(IReadOnlyList<Property> Items, long Total)> SearchAsync(
        string? name, string? address, decimal? minPrice, decimal? maxPrice, int page, int size, CancellationToken ct)
    {
        var fb = Builders<Property>.Filter;
        var filters = new List<FilterDefinition<Property>>();

        if (!string.IsNullOrWhiteSpace(name))
            filters.Add(fb.Regex(p => p.Name, new BsonRegularExpression(name, "i")));
        if (!string.IsNullOrWhiteSpace(address))
            filters.Add(fb.Regex(p => p.Address, new BsonRegularExpression(address, "i")));
        if (minPrice.HasValue) filters.Add(fb.Gte(p => p.Price, minPrice.Value));
        if (maxPrice.HasValue) filters.Add(fb.Lte(p => p.Price, maxPrice.Value));

        var filter = filters.Count > 0 ? fb.And(filters) : FilterDefinition<Property>.Empty;

        var query = _ctx.Properties.Find(filter);
        var total = await query.CountDocumentsAsync(ct);

        var items = await query.SortByDescending(x => x.CreatedAt)
                               .Skip((page - 1) * size)
                               .Limit(size)
                               .ToListAsync(ct);
        return (items, total);
    }

    public async Task<Property?> GetByIdAsync(string id, CancellationToken ct)
    {
        if (!ObjectId.TryParse(id, out var oid)) return null;
        return await _ctx.Properties.Find(x => x.Id == oid).FirstOrDefaultAsync(ct);
    }

    public async Task<string> CreateAsync(Property p, CancellationToken ct)
    {
        await _ctx.Properties.InsertOneAsync(p, cancellationToken: ct);
        return p.Id.ToString();
    }

    public async Task<bool> UpdateAsync(string id, Property p, CancellationToken ct)
    {
        if (!ObjectId.TryParse(id, out var oid)) return false;
        p.Id = oid;
        var res = await _ctx.Properties.ReplaceOneAsync(x => x.Id == oid, p, cancellationToken: ct);
        return res.IsAcknowledged && res.ModifiedCount == 1;
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken ct)
    {
        if (!ObjectId.TryParse(id, out var oid)) return false;
        var res = await _ctx.Properties.DeleteOneAsync(x => x.Id == oid, ct);
        return res.IsAcknowledged && res.DeletedCount == 1;
    }
}
