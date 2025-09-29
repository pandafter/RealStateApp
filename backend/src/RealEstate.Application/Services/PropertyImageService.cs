using MongoDB.Bson;
using RealEstate.Application.Dtos;
using RealEstate.Domain.Entities;
using RealEstate.Infrastructure.Repositories;

namespace RealEstate.Application.Services;

public class PropertyImageService
{
    private readonly IPropertyImageRepository _repo;
    public PropertyImageService(IPropertyImageRepository repo) => _repo = repo;

    public async Task<List<PropertyImageDto>> GetByPropertyAsync(string idProperty, CancellationToken ct)
    {
        var list = await _repo.GetByPropertyAsync(idProperty, ct);
        return list.Select(x => new PropertyImageDto(
            x.IdPropertyImage.ToString(),
            x.IdProperty.ToString(),
            x.File, x.Enabled)).ToList();
    }

    public async Task<string> CreateAsync(CreatePropertyImageRequest req, CancellationToken ct)
    {
        var img = new PropertyImage
        {
            IdPropertyImage = ObjectId.GenerateNewId(),
            IdProperty = ObjectId.Parse(req.IdProperty),
            File = req.File,
            Enabled = req.Enabled
        };
        return await _repo.CreateAsync(img, ct);
    }

    public Task<bool> SetEnabledAsync(string idImage, bool enabled, CancellationToken ct)
        => _repo.SetEnabledAsync(idImage, enabled, ct);

    public Task<bool> DeleteAsync(string idImage, CancellationToken ct)
        => _repo.DeleteAsync(idImage, ct);
}
