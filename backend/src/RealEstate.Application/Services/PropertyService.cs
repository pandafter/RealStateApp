using MongoDB.Bson;
using RealEstate.Application.Dtos;
using RealEstate.Domain.Entities;
using RealEstate.Infrastructure.Repositories;

namespace RealEstate.Application.Services;

public class PropertyService
{
    private readonly IPropertyRepository _repo;
    private readonly IPropertyImageRepository _imgRepo;

    public PropertyService(IPropertyRepository repo, IPropertyImageRepository imgRepo)
    {
        _repo = repo;
        _imgRepo = imgRepo;
    }

    // -------- BÚSQUEDA: con PropertyFilter --------
    public async Task<(IReadOnlyList<PropertyResponseDto> Items, long Total)> SearchAsync(
        PropertyFilter f, CancellationToken ct)
    {
        var page = f.Page < 1 ? 1 : f.Page;
        var size = f.Size is < 1 or > 50 ? 20 : f.Size;

        decimal? min = f.MinPrice;
        decimal? max = f.MaxPrice;
        if (min.HasValue && max.HasValue && min > max)
            (min, max) = (max, min);

        var (items, total) = await _repo.SearchAsync(
            f.Name, f.Address, min, max, page, size, ct);

        return (items.Select(MapToDto).ToList(), total);
    }

    // -------- BÚSQUEDA: con parámetros sueltos (para endpoints) --------
    public async Task<(IReadOnlyList<PropertyResponseDto> Items, long Total)> SearchAsync(
        string? name, string? address, decimal? minPrice, decimal? maxPrice,
        int page, int size, CancellationToken ct)
    {
        page = page < 1 ? 1 : page;
        size = size is < 1 or > 50 ? 20 : size;

        decimal? min = minPrice;
        decimal? max = maxPrice;
        if (min.HasValue && max.HasValue && min > max)
            (min, max) = (max, min);

        var (items, total) = await _repo.SearchAsync(
            name, address, min, max, page, size, ct);

        return (items.Select(MapToDto).ToList(), total);
    }

    public async Task<PropertyResponseDto?> GetAsync(string id, CancellationToken ct)
    {
        var p = await _repo.GetByIdAsync(id, ct);
        return p is null ? null : MapToDto(p);
    }

    public async Task<string> CreateAsync(CreatePropertyRequest r, CancellationToken ct)
    {
        var now = DateTime.UtcNow;

        var entity = new Property
        {
            Id = ObjectId.GenerateNewId(),
            IdOwner = ObjectId.Parse(r.IdOwner),
            Name = r.Name,
            Address = r.Address,
            Price = r.Price,
            CodeInternal = r.CodeInternal,
            Year = r.Year,
            CreatedAt = now,
            UpdatedAt = now
        };

        return await _repo.CreateAsync(entity, ct);
    }

    public async Task<bool> UpdateAsync(string id, UpdatePropertyRequest r, CancellationToken ct)
    {
        var existing = await _repo.GetByIdAsync(id, ct);
        if (existing is null) return false;

        existing.IdOwner = ObjectId.Parse(r.IdOwner);
        existing.Name = r.Name;
        existing.Address = r.Address;
        existing.Price = r.Price;
        existing.CodeInternal = r.CodeInternal;
        existing.Year = r.Year;
        existing.UpdatedAt = DateTime.UtcNow;

        return await _repo.UpdateAsync(id, existing, ct);
    }

    public Task<bool> DeleteAsync(string id, CancellationToken ct) =>
        _repo.DeleteAsync(id, ct);

    private static PropertyResponseDto MapToDto(Property p) =>
        new(
            p.Id.ToString(),
            p.IdOwner.ToString(),
            p.Name,
            p.Address,
            p.Price,
            p.CodeInternal,
            p.Year
        );

    // -------- Portadas --------
    public async Task<string?> GetCoverAsync(ObjectId idProperty, CancellationToken ct)
    {
        var imgs = await _imgRepo.GetByPropertyAsync(idProperty.ToString(), ct);
        return imgs.FirstOrDefault(x => x.Enabled)?.File ?? imgs.FirstOrDefault()?.File;
    }

    public async Task<PropertyDto?> GetWithCoverAsync(string id, CancellationToken ct)
    {
        var p = await _repo.GetByIdAsync(id, ct);
        if (p is null) return null;

        var imageUrl = await GetCoverAsync(p.Id, ct);
        return new PropertyDto(
            p.Id.ToString(),
            p.IdOwner.ToString(),
            p.Name,
            p.Address,
            p.Price,
            p.CodeInternal,
            p.Year,
            imageUrl
        );
    }

    public async Task<(IReadOnlyList<PropertyDto> Items, long Total)> SearchWithCoverAsync(
        PropertyFilter f, CancellationToken ct)
    {
        var page = f.Page < 1 ? 1 : f.Page;
        var size = f.Size is < 1 or > 50 ? 20 : f.Size;

        decimal? min = f.MinPrice;
        decimal? max = f.MaxPrice;
        if (min.HasValue && max.HasValue && min > max)
            (min, max) = (max, min);

        var (items, total) = await _repo.SearchAsync(
            f.Name, f.Address, min, max, page, size, ct);

        var list = new List<PropertyDto>(items.Count);
        foreach (var p in items)
        {
            var cover = await GetCoverAsync(p.Id, ct);
            list.Add(new PropertyDto(
                p.Id.ToString(),
                p.IdOwner.ToString(),
                p.Name,
                p.Address,
                p.Price,
                p.CodeInternal,
                p.Year,
                cover
            ));
        }

        return (list, total);
    }
}
