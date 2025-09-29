using MongoDB.Bson;
using MongoDB.Driver;
using RealEstate.Domain.Entities;
using RealEstate.Infrastructure.Mongo;

namespace RealEstate.Infrastructure.Repositories;

public class PropertyImageRepository : IPropertyImageRepository
{
    private readonly MongoContext _ctx;
    public PropertyImageRepository(MongoContext ctx) => _ctx = ctx;

    public async Task<List<PropertyImage>> GetByPropertyAsync(string idProperty, CancellationToken ct)
    {
        var pid = ObjectId.Parse(idProperty);
        return await _ctx.PropertyImages.Find(x => x.IdProperty == pid).ToListAsync(ct);
    }

    public async Task<string> CreateAsync(PropertyImage img, CancellationToken ct)
    {
        img.IdPropertyImage = ObjectId.GenerateNewId();
        await _ctx.PropertyImages.InsertOneAsync(img, cancellationToken: ct);
        return img.IdPropertyImage.ToString();
    }

    public async Task<bool> SetEnabledAsync(string idImage, bool enabled, CancellationToken ct)
    {
        var iid = ObjectId.Parse(idImage);
        var upd = Builders<PropertyImage>.Update.Set(x => x.Enabled, enabled);
        var res = await _ctx.PropertyImages.UpdateOneAsync(x => x.IdPropertyImage == iid, upd, cancellationToken: ct);
        return res.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string idImage, CancellationToken ct)
    {
        var iid = ObjectId.Parse(idImage);
        var res = await _ctx.PropertyImages.DeleteOneAsync(x => x.IdPropertyImage == iid, ct);
        return res.DeletedCount > 0;
    }
}
