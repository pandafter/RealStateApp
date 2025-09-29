using RealEstate.Domain.Entities;

namespace RealEstate.Infrastructure.Repositories;

public interface IPropertyImageRepository
{
    Task<List<PropertyImage>> GetByPropertyAsync(string idProperty, CancellationToken ct);
    Task<string> CreateAsync(PropertyImage img, CancellationToken ct);
    Task<bool> SetEnabledAsync(string idImage, bool enabled, CancellationToken ct);
    Task<bool> DeleteAsync(string idImage, CancellationToken ct);
}
