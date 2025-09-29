namespace RealEstate.Application.Dtos;

public record PropertyTraceDto(string Id, string IdProperty, DateTime DateSale, string Name, decimal Value, decimal Tax);
public record CreatePropertyTraceRequest(string IdProperty, DateTime DateSale, string Name, decimal Value, decimal Tax);
