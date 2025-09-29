using FluentValidation;
using FluentValidation.AspNetCore;
using RealEstate.Application.Dtos;
using RealEstate.Application.Services;
using RealEstate.Application.Validation;
using RealEstate.Infrastructure.Mongo;
using RealEstate.Infrastructure.Repositories;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Options
builder.Services.Configure<MongoOptions>(builder.Configuration.GetSection("Mongo"));

// Infra
builder.Services.AddSingleton<MongoContext>();
builder.Services.AddSingleton<IndexesInitializer>();
builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();
builder.Services.AddScoped<IOwnerRepository, OwnerRepository>();
builder.Services.AddScoped<IPropertyImageRepository, PropertyImageRepository>();
builder.Services.AddScoped<IPropertyTraceRepository, PropertyTraceRepository>();

// Services
builder.Services.AddScoped<PropertyService>();
builder.Services.AddScoped<OwnerService>();
builder.Services.AddScoped<PropertyImageService>();
builder.Services.AddScoped<PropertyTraceService>();

// Validation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CreatePropertyValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateOwnerValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreatePropertyImageValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreatePropertyTraceValidator>();
builder.Services.AddScoped<IValidator<CreateOwnerRequest>, CreateOwnerValidator>();
builder.Services.AddScoped<IValidator<UpdateOwnerRequest>, UpdateOwnerValidator>();
builder.Services.AddScoped<IValidator<CreatePropertyRequest>, CreatePropertyValidator>();
builder.Services.AddScoped<IValidator<UpdatePropertyRequest>, UpdatePropertyValidator>();



// Swagger & Problem Details
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddProblemDetails();

// CORS
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseCors();
app.UseExceptionHandler();

if (app.Configuration.GetSection("Swagger").GetValue<bool>("Enabled"))
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Ensure Indexes
using (var scope = app.Services.CreateScope())
{
    var idx = scope.ServiceProvider.GetRequiredService<IndexesInitializer>();
    await idx.EnsureAsync(CancellationToken.None);
}

// --- PROPERTIES (ya los tienes; solo asegúrate de mapear CodeInternal/Year y ImageUrl) ---
// ... tus endpoints existentes de /api/v1/properties

// --- OWNERS ---
var owners = app.MapGroup("/api/v1/owners");

owners.MapGet("{id}", async (string id, OwnerService svc, CancellationToken ct) =>
{
    var dto = await svc.GetAsync(id, ct);
    return dto is null ? Results.NotFound() : Results.Ok(dto);
});

owners.MapPost("", async (CreateOwnerRequest req, IValidator<CreateOwnerRequest> v, OwnerService svc, CancellationToken ct) =>
{
    var val = await v.ValidateAsync(req, ct);
    if (!val.IsValid) return Results.ValidationProblem(val.ToDictionary());
    var id = await svc.CreateAsync(req, ct);
    return Results.Created($"/api/v1/owners/{id}", new { id });
});

owners.MapPut("{id}", async (string id, UpdateOwnerRequest req, IValidator<UpdateOwnerRequest> v, OwnerService svc, CancellationToken ct) =>
{
    var val = await v.ValidateAsync(req, ct);
    if (!val.IsValid) return Results.ValidationProblem(val.ToDictionary());
    var ok = await svc.UpdateAsync(id, req, ct);
    return ok ? Results.NoContent() : Results.NotFound();
});

owners.MapDelete("{id}", async (string id, OwnerService svc, CancellationToken ct) =>
{
    var ok = await svc.DeleteAsync(id, ct);
    return ok ? Results.NoContent() : Results.NotFound();
});

// --- PROPERTY IMAGES ---
var images = app.MapGroup("/api/v1/properties/{id}/images");

images.MapGet("", async (string id, PropertyImageService svc, CancellationToken ct)
    => Results.Ok(await svc.GetByPropertyAsync(id, ct)));

images.MapPost("", async (string id, CreatePropertyImageRequest req, IValidator<CreatePropertyImageRequest> v, PropertyImageService svc, CancellationToken ct) =>
{
    // forzamos IdProperty de la ruta
    req = req with { IdProperty = id };

    var val = await v.ValidateAsync(req, ct);
    if (!val.IsValid) return Results.ValidationProblem(val.ToDictionary());

    var imgId = await svc.CreateAsync(req, ct);
    return Results.Created($"/api/v1/properties/{id}/images/{imgId}", new { id = imgId });
});

images.MapPut("{imageId}/enabled", async (string id, string imageId, SetImageEnabledRequest req, PropertyImageService svc, CancellationToken ct) =>
{
    var ok = await svc.SetEnabledAsync(imageId, req.Enabled, ct);
    return ok ? Results.NoContent() : Results.NotFound();
});

images.MapDelete("{imageId}", async (string id, string imageId, PropertyImageService svc, CancellationToken ct) =>
{
    var ok = await svc.DeleteAsync(imageId, ct);
    return ok ? Results.NoContent() : Results.NotFound();
});


// --- PROPERTIES ---
var properties = app.MapGroup("/api/v1/properties");

properties.MapGet("", async (
    string? name,
    string? address,
    decimal? minPrice,
    decimal? maxPrice,
    int page,
    int size,
    PropertyService svc,
    CancellationToken ct) =>
{
    var (items, total) = await svc.SearchAsync(name, address, minPrice, maxPrice, page, size, ct);
    return Results.Ok(new { items, total, page, size });
});



properties.MapGet("{id}", async (string id, PropertyService svc, CancellationToken ct) =>
{
    var dto = await svc.GetWithCoverAsync(id, ct);
    return dto is null ? Results.NotFound() : Results.Ok(dto);
});

properties.MapPost("", async (CreatePropertyRequest req, IValidator<CreatePropertyRequest> v, PropertyService svc, CancellationToken ct) =>
{
    var val = await v.ValidateAsync(req, ct);
    if (!val.IsValid) return Results.ValidationProblem(val.ToDictionary());

    var id = await svc.CreateAsync(req, ct);
    return Results.Created($"/api/v1/properties/{id}", new { id });
});

properties.MapPut("{id}", async (string id, UpdatePropertyRequest req, IValidator<UpdatePropertyRequest> v, PropertyService svc, CancellationToken ct) =>
{
    var val = await v.ValidateAsync(req, ct);
    if (!val.IsValid) return Results.ValidationProblem(val.ToDictionary());

    var ok = await svc.UpdateAsync(id, req, ct);
    return ok ? Results.NoContent() : Results.NotFound();
});

properties.MapDelete("{id}", async (string id, PropertyService svc, CancellationToken ct) =>
{
    var ok = await svc.DeleteAsync(id, ct);
    return ok ? Results.NoContent() : Results.NotFound();
});




// --- PROPERTY TRACES ---
var traces = app.MapGroup("/api/v1/properties/{id}/traces");

traces.MapGet("", async (string id, PropertyTraceService svc, CancellationToken ct)
    => Results.Ok(await svc.GetByPropertyAsync(id, ct)));

traces.MapPost("", async (string id, CreatePropertyTraceRequest req, IValidator<CreatePropertyTraceRequest> v, PropertyTraceService svc, CancellationToken ct) =>
{
    req = req with { IdProperty = id };

    var val = await v.ValidateAsync(req, ct);
    if (!val.IsValid) return Results.ValidationProblem(val.ToDictionary());

    var tid = await svc.CreateAsync(req, ct);
    return Results.Created($"/api/v1/properties/{id}/traces/{tid}", new { id = tid });
});

traces.MapDelete("{traceId}", async (string id, string traceId, PropertyTraceService svc, CancellationToken ct) =>
{
    var ok = await svc.DeleteAsync(traceId, ct);
    return ok ? Results.NoContent() : Results.NotFound();
});

app.Run();
