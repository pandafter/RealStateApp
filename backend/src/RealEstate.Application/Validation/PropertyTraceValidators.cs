using FluentValidation;
using RealEstate.Application.Dtos;

namespace RealEstate.Application.Validation;

public class CreatePropertyTraceValidator : AbstractValidator<CreatePropertyTraceRequest>
{
    public CreatePropertyTraceValidator()
    {
        RuleFor(x => x.IdProperty).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Value).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Tax).GreaterThanOrEqualTo(0);
        RuleFor(x => x.DateSale).LessThanOrEqualTo(DateTime.UtcNow.AddDays(1));
    }
}
