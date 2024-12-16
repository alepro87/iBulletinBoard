using Core.Entities;

namespace Core.Specifications;

public class CategoryListSpecification : BaseSpecification<Advertisement, string>
{
    public CategoryListSpecification()
    {
        AddSelect(x => x.Category);
        ApplyDistinct();
    }
}
