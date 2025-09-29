using FluentValidation;
using RealEstate.Application.Dtos;

public class CreateOwnerValidator : AbstractValidator<CreateOwnerRequest>
{
    public CreateOwnerValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Address).NotEmpty();
    }
}

public class UpdateOwnerValidator : AbstractValidator<UpdateOwnerRequest>
{
    public UpdateOwnerValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Address).NotEmpty();
    }
}
