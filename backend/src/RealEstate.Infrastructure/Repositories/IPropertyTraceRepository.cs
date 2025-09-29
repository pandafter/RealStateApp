using RealEstate.Domain.Entities;

namespace RealEstate.Infrastructure.Repositories;

public interface IPropertyTraceRepository
{
    Task<List<PropertyTrace>> GetByPropertyAsync(string idProperty, CancellationToken ct);
    Task<string> CreateAsync(PropertyTrace tr, CancellationToken ct);
    Task<bool> DeleteAsync(string idTrace, CancellationToken ct);
}
