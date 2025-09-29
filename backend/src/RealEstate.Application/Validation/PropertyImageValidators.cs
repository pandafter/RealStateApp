using FluentValidation;
using RealEstate.Application.Dtos;

namespace RealEstate.Application.Validation;

public class CreatePropertyImageValidator : AbstractValidator<CreatePropertyImageRequest>
{
    public CreatePropertyImageValidator()
    {
        RuleFor(x => x.IdProperty).NotEmpty();
        RuleFor(x => x.File).NotEmpty().MaximumLength(500);
    }
}
