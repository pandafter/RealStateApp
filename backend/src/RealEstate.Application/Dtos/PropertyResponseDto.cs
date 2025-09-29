namespace RealEstate.Application.Dtos;

public record PropertyResponseDto(
    string Id,
    object IdOwner,
    string Name,
    string Address,
    decimal Price,
    string CodeInternal,
    int Year
);
