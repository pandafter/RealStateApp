using MongoDB.Bson;
using MongoDB.Driver;
using RealEstate.Domain.Entities;
using RealEstate.Infrastructure.Mongo;

namespace RealEstate.Infrastructure.Repositories;

public class PropertyTraceRepository : IPropertyTraceRepository
{
    private readonly MongoContext _ctx;
    public PropertyTraceRepository(MongoContext ctx) => _ctx = ctx;

    public async Task<List<PropertyTrace>> GetByPropertyAsync(string idProperty, CancellationToken ct)
    {
        var pid = ObjectId.Parse(idProperty);
        return await _ctx.PropertyTraces
            .Find(x => x.IdProperty == pid)
            .SortByDescending(x => x.DateSale)
            .ToListAsync(ct);
    }

    public async Task<string> CreateAsync(PropertyTrace tr, CancellationToken ct)
    {
        tr.IdPropertyTrace = ObjectId.GenerateNewId();
        await _ctx.PropertyTraces.InsertOneAsync(tr, cancellationToken: ct);
        return tr.IdPropertyTrace.ToString();
    }

    public async Task<bool> DeleteAsync(string idTrace, CancellationToken ct)
    {
        var tid = ObjectId.Parse(idTrace);
        var res = await _ctx.PropertyTraces.DeleteOneAsync(x => x.IdPropertyTrace == tid, ct);
        return res.DeletedCount > 0;
    }
}
