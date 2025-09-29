using MongoDB.Bson;
using RealEstate.Application.Dtos;
using RealEstate.Domain.Entities;
using RealEstate.Infrastructure.Repositories;

namespace RealEstate.Application.Services;

public class OwnerService
{
    private readonly IOwnerRepository _repo;
    public OwnerService(IOwnerRepository repo) => _repo = repo;

    public async Task<OwnerDto?> GetAsync(string id, CancellationToken ct)
    {
        var o = await _repo.GetAsync(id, ct);
        return o is null ? null : new OwnerDto(o.IdOwner.ToString(), o.Name, o.Address, o.Photo, o.Birthday);
    }

    public async Task<string> CreateAsync(CreateOwnerRequest req, CancellationToken ct)
    {
        var o = new Owner
        {
            IdOwner = ObjectId.GenerateNewId(),
            Name = req.Name,
            Address = req.Address,
            Photo = req.Photo,
            Birthday = req.Birthday
        };
        return await _repo.CreateAsync(o, ct);
    }

    public async Task<bool> UpdateAsync(string id, UpdateOwnerRequest req, CancellationToken ct)
    {
        var o = new Owner
        {
            IdOwner = ObjectId.Parse(id),
            Name = req.Name,
            Address = req.Address,
            Photo = req.Photo,
            Birthday = req.Birthday
        };
        return await _repo.UpdateAsync(o, ct);
    }

    public Task<bool> DeleteAsync(string id, CancellationToken ct) => _repo.DeleteAsync(id, ct);
}
