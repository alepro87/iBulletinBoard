using System.Data;
using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{
    /// <summary>
    /// Creates a paginated result for any entity type that inherits from BaseEntity
    /// </summary>
    /// <typeparam name="T">The type of entity to paginate</typeparam>
    /// <param name="repo">The repository to fetch items from</param>
    /// <param name="spec">The specification to filter and sort items</param>
    /// <param name="pageIndex">The current page number (0-based)</param>
    /// <param name="pageSize">The number of items per page</param>
    /// <returns>ActionResult containing Pagination object with items and metadata</returns>
    protected async Task<ActionResult> CreatePagedResult<T>(IGenericRepository<T> repo,
        ISpecification<T> spec, int pageIndex, int pageSize) where T : BaseEntity
    {
        var items = await repo.ListAsync(spec);
        var count = await repo.CountAsync(spec);

        var pagination = new Pagination<T>(pageIndex, pageSize, count, items);

        return Ok(pagination);
    }
}
