using RealEstate.Domain.Entities;

namespace RealEstate.Infrastructure.Repositories;

public interface IPropertyRepository
{
    Task<(IReadOnlyList<Property> Items, long Total)> SearchAsync(
        string? name, string? address, decimal? minPrice, decimal? maxPrice, int page, int size, CancellationToken ct);

    Task<Property?> GetByIdAsync(string id, CancellationToken ct);
    Task<string> CreateAsync(Property p, CancellationToken ct);
    Task<bool> UpdateAsync(string id, Property p, CancellationToken ct);
    Task<bool> DeleteAsync(string id, CancellationToken ct);
}
