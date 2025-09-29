using FluentValidation;
using RealEstate.Application.Dtos;

public class CreatePropertyValidator : AbstractValidator<CreatePropertyRequest>
{
    public CreatePropertyValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Address).NotEmpty();
        RuleFor(x => x.Price).GreaterThan(0);
        RuleFor(x => x.Year).InclusiveBetween(1900, DateTime.UtcNow.Year);
        RuleFor(x => x.ImageUrl).MaximumLength(500).When(x => !string.IsNullOrEmpty(x.ImageUrl));
    }
}

public class UpdatePropertyValidator : AbstractValidator<UpdatePropertyRequest>
{
    public UpdatePropertyValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Address).NotEmpty();
        RuleFor(x => x.Price).GreaterThan(0);
        RuleFor(x => x.Year).InclusiveBetween(1900, DateTime.UtcNow.Year);
        RuleFor(x => x.ImageUrl).MaximumLength(500).When(x => !string.IsNullOrEmpty(x.ImageUrl));
    }
}
