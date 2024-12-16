using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data;

public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
{
    private readonly JsonFileService m_JsonFileService;
    private List<T> m_Entities;

    public GenericRepository(JsonFileService jsonFileService)
    {
        m_JsonFileService = jsonFileService;
        m_Entities = m_JsonFileService.GetAll<T>().ToList();
    }

    public void Add(T entity)
    {
        if (entity.Id == 0)
        {
            entity.Id = m_Entities.Any()
                ? m_Entities.Max(e => e.Id) + 1
                : 1;
        }
        m_Entities.Add(entity);
    }

    public async Task<int> CountAsync(ISpecification<T> spec)
    {
        var query = m_Entities.AsQueryable();
        query = spec.ApplyCriteria(query);
        return await Task.FromResult(query.Count());
    }

    public bool Exists(int id)
    {
        return m_Entities.Any(x => x.Id == id);
    }

    public async Task<T?> GetByIdAsync(int id)
    {
        return await Task.FromResult(m_Entities.FirstOrDefault(x => x.Id == id));
    }

    public async Task<T?> GetEntityWithSpec(ISpecification<T> spec)
    {
        return await Task.FromResult(ApplySpecification(spec).FirstOrDefault());
    }

    public async Task<TResult?> GetEntityWithSpec<TResult>(ISpecification<T, TResult> spec)
    {
        return await Task.FromResult(ApplySpecification<TResult>(spec).FirstOrDefault());
    }

    public async Task<IReadOnlyList<T>> ListAllAsync()
    {
        return await Task.FromResult(m_Entities.ToList().AsReadOnly());
    }

    public async Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec)
    {
        return await Task.FromResult(ApplySpecification(spec).ToList().AsReadOnly());
    }

    public async Task<IReadOnlyList<TResult>> ListAsync<TResult>(ISpecification<T, TResult> spec)
    {
        return await Task.FromResult(ApplySpecification<TResult>(spec).ToList().AsReadOnly());
    }

    public void Remove(T entity)
    {
        m_Entities.Remove(entity);
    }

    public async Task<bool> SaveAllAsync()
    {
        try
        {
            await m_JsonFileService.SaveAllAsync(m_Entities);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public void Update(T entity)
    {
        var existingEntity = m_Entities.FirstOrDefault(e => e.Id == entity.Id);
        if (existingEntity != null)
        {
            m_Entities.Remove(existingEntity);
            m_Entities.Add(entity);
        }
    }

    private IQueryable<T> ApplySpecification(ISpecification<T> spec)
    {
        var query = m_Entities.AsQueryable();
        return SpecificationEvaluator<T>.GetQuery(query, spec);
    }

    private IQueryable<TResult> ApplySpecification<TResult>(ISpecification<T, TResult> spec)
    {
        var query = m_Entities.AsQueryable();
        return SpecificationEvaluator<T>.GetQuery<ISpecification<T, TResult>, TResult>(query, spec);
    }
}
