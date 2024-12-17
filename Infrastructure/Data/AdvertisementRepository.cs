using System;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data;

public class AdvertisementRepository(JsonFileService jsonFileService) : IAdvertisementRepository
{
    // In-memory cache of advertisements to avoid constant file reads
    private List<Advertisement> m_Advertisements = jsonFileService.GetAll<Advertisement>().ToList();

    // Get filtered and sorted list of advertisements
    // Parameters:
    // - category: Filter by category (optional)
    // - location: Filter by location (optional)
    // - sort: Sort order (date_asc, date_desc)
    // - By default sort by advertisement ID
    public async Task<IReadOnlyList<Advertisement>> GetAdvertisementsAsync(string? category, string? location, string? sort)
    {
        var query = m_Advertisements.AsQueryable();

        // Apply optional filters
        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(a => a.Category == category);

        if (!string.IsNullOrWhiteSpace(location))
            query = query.Where(a => a.Location == location);

        // Apply optional sorting
        query = sort switch
        {
            "dateAsc" => query.OrderBy(a => a.PostDate),
            "dateDesc" => query.OrderByDescending(a => a.PostDate),
            "title" => query.OrderBy(a => a.Title),
            _ => query.OrderBy(a => a.Id)
        };

        return await Task.FromResult(query.ToList().AsReadOnly());
    }

    // Find a single advertisement by its ID
    // Return null if advertisement is not found
    public async Task<Advertisement?> GetAdvertisementByIdAsync(int id)
    {
        return await Task.FromResult(m_Advertisements.FirstOrDefault(a => a.Id == id));
    }

    // Get list of unique categories from all advertisements
    // Used for filtering UI
    public async Task<IReadOnlyList<string>> GetCategoriesAsync()
    {
        return await Task.FromResult(m_Advertisements
            .Select(a => a.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToList()
            .AsReadOnly());
    }

    // Get list of unique locations from all advertisements
    // Used for filtering UI
    public async Task<IReadOnlyList<string>> GetLocationsAsync()
    {
        return await Task.FromResult(m_Advertisements
            .Select(a => a.Location)
            .Distinct()
            .ToList()
            .AsReadOnly());
    }

    // Add new advertisement to in-memory cache
    // Generate new ID if not provided
    // Set creation date
    public void AddAdvertisement(Advertisement advertisement)
    {
        if (advertisement.Id == 0)
        {
            advertisement.Id = m_Advertisements.Any()
                ? m_Advertisements.Max(a => a.Id) + 1
                : 1;
        }
        // Get local timezone
        var localZone = TimeZoneInfo.Local;
        // Convert UTC to local time
        var localTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, localZone);
        advertisement.PostDate = localTime.ToString("dd MMM yyyy 'at' HH:mm");
        //advertisement.PostDate = DateTime.Now.ToString("MMM dd YYYY at HH:mm");
        m_Advertisements.Add(advertisement);
    }

    // Update existing advertisement in in-memory cache
    // Replace old version with new version
    public void UpdateAdvertisement(Advertisement advertisement)
    {
        var existingAd = m_Advertisements.FirstOrDefault(a => a.Id == advertisement.Id);

        if (existingAd != null)
        {
            m_Advertisements.Remove(existingAd);
            m_Advertisements.Add(advertisement);
        }
    }

    // Remove advertisement from in-memory cache
    public void DeleteAdvertisement(Advertisement advertisement)
    {
        m_Advertisements.Remove(advertisement);
    }

    // Check if the advertisement with given ID exists in-memory cache
    public async Task<bool> AdvertisementExists(int id)
    {
        return await Task.FromResult(m_Advertisements.Any(a => a.Id == id));
    }

    // Save all changes from in-memory cache to JSON file
    // Return true if successful, false if failed
    public async Task<bool> SaveChangesAsync()
    {
        try
        {
            await jsonFileService.SaveAllAsync(m_Advertisements);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
