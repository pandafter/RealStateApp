using MongoDB.Bson;
using RealEstate.Application.Dtos;
using RealEstate.Domain.Entities;
using RealEstate.Infrastructure.Repositories;

namespace RealEstate.Application.Services;

public class PropertyTraceService
{
    private readonly IPropertyTraceRepository _repo;
    public PropertyTraceService(IPropertyTraceRepository repo) => _repo = repo;

    public async Task<List<PropertyTraceDto>> GetByPropertyAsync(string idProperty, CancellationToken ct)
    {
        var list = await _repo.GetByPropertyAsync(idProperty, ct);
        return list.Select(x => new PropertyTraceDto(
            x.IdPropertyTrace.ToString(),
            x.IdProperty.ToString(),
            x.DateSale, x.Name, x.Value, x.Tax)).ToList();
    }

    public async Task<string> CreateAsync(CreatePropertyTraceRequest req, CancellationToken ct)
    {
        var tr = new PropertyTrace
        {
            IdPropertyTrace = ObjectId.GenerateNewId(),
            IdProperty = ObjectId.Parse(req.IdProperty),
            DateSale = req.DateSale,
            Name = req.Name,
            Value = req.Value,
            Tax = req.Tax
        };
        return await _repo.CreateAsync(tr, ct);
    }

    public Task<bool> DeleteAsync(string idTrace, CancellationToken ct)
        => _repo.DeleteAsync(idTrace, ct);
}
