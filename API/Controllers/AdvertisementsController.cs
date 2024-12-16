using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdvertisementsController(IGenericRepository<Advertisement> repo) : BaseApiController
    {

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Advertisement>>> GetAdvertisements(
            [FromQuery] AdvertisementSpecParams specParams)
        {
            var spec = new AdvertisementSpecification(specParams);

            return await CreatePagedResult(repo, spec, specParams.PageIndex, specParams.PageSize);
        }

        [HttpGet("{id:int}")] //api/advertisements/2
        public async Task<ActionResult<Advertisement>> GetAdvertisement(int id)
        {
            var advertisement = await repo.GetByIdAsync(id);

            if (advertisement == null) return NotFound();

            return advertisement;
        }

        [HttpPost]
        public async Task<ActionResult<Advertisement>> CreateAdvertisement(Advertisement advertisement)
        {
            repo.Add(advertisement);

            if (await repo.SaveAllAsync())
            {
                return CreatedAtAction("GetAdvertisement", new { id = advertisement.Id }, advertisement);
            }

            return BadRequest("Problem creating advertisement");
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult> UpdateAdvertisement(int id, Advertisement advertisement)
        {
            if (advertisement.Id != id || !AdvertisementExists(id))
                return BadRequest("Cannot update this advertisement");

            repo.Update(advertisement);

            if (await repo.SaveAllAsync())
            {
                return NoContent();
            }

            return BadRequest("Problem updating the advertisement");
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteAdvertisement(int id)
        {
            var advertisement = await repo.GetByIdAsync(id);

            if (advertisement == null) return NotFound();

            repo.Remove(advertisement);

            if (await repo.SaveAllAsync())
            {
                return NoContent();
            }

            return BadRequest("Problem deleting the advertisement");
        }

        [HttpGet("categories")]
        public async Task<ActionResult<IReadOnlyList<string>>> GetCategories()
        {
            var spec = new CategoryListSpecification();

            return Ok(await repo.ListAsync(spec));
        }

        [HttpGet("locations")]
        public async Task<ActionResult<IReadOnlyList<string>>> GetLocations()
        {
            var spec = new LocationListSpecification();

            return Ok(await repo.ListAsync(spec));
        }

        private bool AdvertisementExists(int id)
        {
            return repo.Exists(id);
        }
    }
}
