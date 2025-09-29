using RealEstate.Domain.Entities;

namespace RealEstate.Infrastructure.Repositories;

public interface IOwnerRepository
{
    Task<Owner?> GetAsync(string id, CancellationToken ct);
    Task<string> CreateAsync(Owner o, CancellationToken ct);
    Task<bool> UpdateAsync(Owner o, CancellationToken ct);
    Task<bool> DeleteAsync(string id, CancellationToken ct);
}
