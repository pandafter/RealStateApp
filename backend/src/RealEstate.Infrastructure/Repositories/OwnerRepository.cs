using MongoDB.Bson;
using MongoDB.Driver;
using RealEstate.Domain.Entities;
using RealEstate.Infrastructure.Mongo;

namespace RealEstate.Infrastructure.Repositories;

public class OwnerRepository : IOwnerRepository
{
    private readonly MongoContext _ctx;
    public OwnerRepository(MongoContext ctx) => _ctx = ctx;

    public async Task<Owner?> GetAsync(string id, CancellationToken ct)
    {
        var oid = ObjectId.Parse(id);
        return await _ctx.Owners.Find(x => x.IdOwner == oid).FirstOrDefaultAsync(ct);
    }

    public async Task<string> CreateAsync(Owner o, CancellationToken ct)
    {
        o.IdOwner = ObjectId.GenerateNewId();
        await _ctx.Owners.InsertOneAsync(o, cancellationToken: ct);
        return o.IdOwner.ToString();
    }

    public async Task<bool> UpdateAsync(Owner o, CancellationToken ct)
    {
        var res = await _ctx.Owners.ReplaceOneAsync(x => x.IdOwner == o.IdOwner, o, cancellationToken: ct);
        return res.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken ct)
    {
        var oid = ObjectId.Parse(id);
        var res = await _ctx.Owners.DeleteOneAsync(x => x.IdOwner == oid, ct);
        return res.DeletedCount > 0;
    }
}
