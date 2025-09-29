namespace RealEstate.Application.Dtos;

public record OwnerDto(string Id, string Name, string Address, string? Photo, DateTime? Birthday);
public record CreateOwnerRequest(string Name, string Address, string? Photo, DateTime? Birthday);
public record UpdateOwnerRequest(string Name, string Address, string? Photo, DateTime? Birthday);
