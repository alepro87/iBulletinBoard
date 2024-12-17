using System;
using System.Text.Json;
using Core.Entities;

namespace Infrastructure.Data;

public class JsonFileService
{
    private readonly string m_BaseFilePath;
    private readonly object m_Lock = new object();

    public JsonFileService(string baseFilePath = "Data")
    {
        m_BaseFilePath = baseFilePath;
        Directory.CreateDirectory(baseFilePath);
    }

    private string GetFilePath<T>() => Path.Combine(m_BaseFilePath, $"{typeof(T).Name.ToLower()}.json");

    public List<T> GetAll<T>() where T : BaseEntity
    {
        lock (m_Lock)
        {
            var filePath = GetFilePath<T>();
            if (!File.Exists(filePath))
                return new List<T>();
                
            var jsonString = File.ReadAllText(filePath);
            return JsonSerializer.Deserialize<List<T>>(jsonString) ?? new List<T>();
        }
    }

    public async Task SaveAllAsync<T>(List<T> entities) where T : BaseEntity
    {
        var filePath = GetFilePath<T>();
        var jsonString = JsonSerializer.Serialize(entities, new JsonSerializerOptions 
        { 
            WriteIndented = true
        });
        
        await File.WriteAllTextAsync(filePath, jsonString);
    }
}
