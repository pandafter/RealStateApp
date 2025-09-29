using MongoDB.Bson;

namespace RealEstate.Application.Dtos;

public record PropertyDto(
    string Id,
    string IdOwner,
    string Name,
    string Address,
    decimal Price,
    string CodeInternal,
    int Year,
    string? ImageUrl
);

public record CreatePropertyRequest(
    ObjectId IdOwner,
    string Name,
    string Address,
    decimal Price,
    string CodeInternal,
    int Year
);

public record UpdatePropertyRequest(
    ObjectId IdOwner,
    string Name,
    string Address,
    decimal Price,
    string CodeInternal,
    int Year
);

public record PropertyFilter(
    string? Name,
    string? Address,
    decimal? MinPrice,
    decimal? MaxPrice,
    int Page,
    int Size
);
