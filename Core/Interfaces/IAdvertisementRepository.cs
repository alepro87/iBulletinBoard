using System.Reflection;
using Core.Entities;

namespace Core.Interfaces;

public interface IAdvertisementRepository
{
    Task<IReadOnlyList<Advertisement>> GetAdvertisementsAsync(string? category, string? location, string? sort);
    Task<Advertisement?> GetAdvertisementByIdAsync(int id);
    Task<IReadOnlyList<string>> GetCategoriesAsync();
    Task<IReadOnlyList<string>> GetLocationsAsync();
    void AddAdvertisement(Advertisement advertisement);
    void UpdateAdvertisement(Advertisement advertisement);
    void DeleteAdvertisement(Advertisement advertisement);
    Task<bool> AdvertisementExists(int id);
    Task<bool> SaveChangesAsync();
}
