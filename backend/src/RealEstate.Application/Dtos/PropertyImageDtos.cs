namespace RealEstate.Application.Dtos;

public record PropertyImageDto(string Id, string IdProperty, string File, bool Enabled);
public record CreatePropertyImageRequest(string IdProperty, string File, bool Enabled);
public record SetImageEnabledRequest(bool Enabled);
