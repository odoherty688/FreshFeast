import React from 'react';

const recipeTest = {
    "uri": "http://www.edamam.com/ontologies/edamam.owl#recipe_926f6ae64fad4eba9f4e936e564cb722",
    "label": "Gluten Free Chicken Teriyaki Kabobs",
    "image": "https://edamam-product-images.s3.amazonaws.com/web-img/c4a/c4a8702514334014258599844922c806.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEyydw%2FQjBOTP5AEDcSEszSKDzT52tK8TSD6wdvDstPhAiBVlCbLUKjaqKbLq5GQ%2FAoSCJrvOl85fQ6bsCqbs2aY7iq5BQh1EAAaDDE4NzAxNzE1MDk4NiIMNQjuzoCAqAEbHe%2FcKpYFQs3Xhu%2FsFlNloIJIpTNnLuH19JBrU7jjk68YNSvML53lqUaZXWEYyFS6HhyosBrwBt8PTtTEC5TAx7T1iTEmR4bePyJsnrHS6iXflBjrTIDjh%2Bntj8I10NSPhgSBRXAwFH8RuXd3gPyzzQ5Rm%2B4x2G1FuNViWZOcVX8H3giYKVFWeiv9LKO%2FoPFkkZKYvfG%2BDSGg4On84ZHlfuQgmaUm7fAcujLgoPjFg3ZlWItH9%2BS0PkcX4bszqphQRJDwb33psyNzN9xtzmrKE6p%2FnHMC6m0JxssCkkWJPhyqQfROpwGPswa5uY5OnZ9o29UJbJ8Vhjdm%2FHCQ3d%2BYDUmjeH6L%2Br4FpgpYNVYsKUu3681%2BSvdnDg9HdELaPmYUQpnbPsJEXJ5AE3S7EFwoIoV0%2FP0Wnp%2FI2UmpGR%2F7m5th91ust2m8y50z8IIDQ65AZjp0M%2FvWFZAHavd2MOO7ZNj841Y84SNOFnogXSABuqLcRfxaGBLnUgJ4muAiQG%2BzPc0%2BCbG8TOEEhoYvQl1zA7dIra0KegXhNPFfxZ99K%2ForOZ5v3cAyBhugIhsDKBd5dkqTErcI2mKrWaqCRkoEN5TdpOt%2F0pn%2BuJsHO4Wl9c3QMZ%2BE6FlhlVyaWHthTAIyWxLQyPP%2BxVXXFkfgxAzU7K6VsQJMxWHDyq0R0xhVWVlnetbZPpFdfcNZ43iFSht2rCCqKcwTocFMR1ZL73gln3uaqoR4qmbgfailikIa%2BQc8XVs1L7EN171QuMwNAK%2F3Tsvai2x7Ke0XV0HIwCQw7no0dfc8WjXL72qORVyuFgVmdq7kRAg9Hz7UirgiPEe9K%2FqqlTdrJwJwaPVfgIwaOKs10bGxp0ER9n9ETFSauyLr7rX1Rtc51FCAFwgwla7arAY6sgGKd6GSd3Gp4rz4qCZb29465G8RVJYXsbBSZs7D3YZdDWsIbDZI%2FqviYLBgMTVGhF%2FGL%2BjCh0Jmy6z82m%2FpBzlsRskrayHKzSfkkZoH3OUEqX5hKNqUZZIHn4J4SFVjXT0nBU5cKBqRMWEgNW1AcDUniMbNXhchrSz2UE2F%2FHm4oG2vS%2FriiLtq3QECNQ1k0ZZwvRnzKDX06xleTFyTSPOitom97odrw3hxs8Q8JLP8BwtH&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240104T120117Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFDGFIW5WC%2F20240104%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=1cc21fd780eeed72b768d67a4c80d98200ac248ba5af693aab5381329eed9e9b",
    "images": {
      "THUMBNAIL": {
        "url": "https://edamam-product-images.s3.amazonaws.com/web-img/c4a/c4a8702514334014258599844922c806-s.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEyydw%2FQjBOTP5AEDcSEszSKDzT52tK8TSD6wdvDstPhAiBVlCbLUKjaqKbLq5GQ%2FAoSCJrvOl85fQ6bsCqbs2aY7iq5BQh1EAAaDDE4NzAxNzE1MDk4NiIMNQjuzoCAqAEbHe%2FcKpYFQs3Xhu%2FsFlNloIJIpTNnLuH19JBrU7jjk68YNSvML53lqUaZXWEYyFS6HhyosBrwBt8PTtTEC5TAx7T1iTEmR4bePyJsnrHS6iXflBjrTIDjh%2Bntj8I10NSPhgSBRXAwFH8RuXd3gPyzzQ5Rm%2B4x2G1FuNViWZOcVX8H3giYKVFWeiv9LKO%2FoPFkkZKYvfG%2BDSGg4On84ZHlfuQgmaUm7fAcujLgoPjFg3ZlWItH9%2BS0PkcX4bszqphQRJDwb33psyNzN9xtzmrKE6p%2FnHMC6m0JxssCkkWJPhyqQfROpwGPswa5uY5OnZ9o29UJbJ8Vhjdm%2FHCQ3d%2BYDUmjeH6L%2Br4FpgpYNVYsKUu3681%2BSvdnDg9HdELaPmYUQpnbPsJEXJ5AE3S7EFwoIoV0%2FP0Wnp%2FI2UmpGR%2F7m5th91ust2m8y50z8IIDQ65AZjp0M%2FvWFZAHavd2MOO7ZNj841Y84SNOFnogXSABuqLcRfxaGBLnUgJ4muAiQG%2BzPc0%2BCbG8TOEEhoYvQl1zA7dIra0KegXhNPFfxZ99K%2ForOZ5v3cAyBhugIhsDKBd5dkqTErcI2mKrWaqCRkoEN5TdpOt%2F0pn%2BuJsHO4Wl9c3QMZ%2BE6FlhlVyaWHthTAIyWxLQyPP%2BxVXXFkfgxAzU7K6VsQJMxWHDyq0R0xhVWVlnetbZPpFdfcNZ43iFSht2rCCqKcwTocFMR1ZL73gln3uaqoR4qmbgfailikIa%2BQc8XVs1L7EN171QuMwNAK%2F3Tsvai2x7Ke0XV0HIwCQw7no0dfc8WjXL72qORVyuFgVmdq7kRAg9Hz7UirgiPEe9K%2FqqlTdrJwJwaPVfgIwaOKs10bGxp0ER9n9ETFSauyLr7rX1Rtc51FCAFwgwla7arAY6sgGKd6GSd3Gp4rz4qCZb29465G8RVJYXsbBSZs7D3YZdDWsIbDZI%2FqviYLBgMTVGhF%2FGL%2BjCh0Jmy6z82m%2FpBzlsRskrayHKzSfkkZoH3OUEqX5hKNqUZZIHn4J4SFVjXT0nBU5cKBqRMWEgNW1AcDUniMbNXhchrSz2UE2F%2FHm4oG2vS%2FriiLtq3QECNQ1k0ZZwvRnzKDX06xleTFyTSPOitom97odrw3hxs8Q8JLP8BwtH&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240104T120117Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFDGFIW5WC%2F20240104%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=8ec1d1eb56cd4417ae8271fbee2e8d891bd1f0888153250b46645354583d3bde",
        "width": 100,
        "height": 100
      },
      "SMALL": {
        "url": "https://edamam-product-images.s3.amazonaws.com/web-img/c4a/c4a8702514334014258599844922c806-m.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEyydw%2FQjBOTP5AEDcSEszSKDzT52tK8TSD6wdvDstPhAiBVlCbLUKjaqKbLq5GQ%2FAoSCJrvOl85fQ6bsCqbs2aY7iq5BQh1EAAaDDE4NzAxNzE1MDk4NiIMNQjuzoCAqAEbHe%2FcKpYFQs3Xhu%2FsFlNloIJIpTNnLuH19JBrU7jjk68YNSvML53lqUaZXWEYyFS6HhyosBrwBt8PTtTEC5TAx7T1iTEmR4bePyJsnrHS6iXflBjrTIDjh%2Bntj8I10NSPhgSBRXAwFH8RuXd3gPyzzQ5Rm%2B4x2G1FuNViWZOcVX8H3giYKVFWeiv9LKO%2FoPFkkZKYvfG%2BDSGg4On84ZHlfuQgmaUm7fAcujLgoPjFg3ZlWItH9%2BS0PkcX4bszqphQRJDwb33psyNzN9xtzmrKE6p%2FnHMC6m0JxssCkkWJPhyqQfROpwGPswa5uY5OnZ9o29UJbJ8Vhjdm%2FHCQ3d%2BYDUmjeH6L%2Br4FpgpYNVYsKUu3681%2BSvdnDg9HdELaPmYUQpnbPsJEXJ5AE3S7EFwoIoV0%2FP0Wnp%2FI2UmpGR%2F7m5th91ust2m8y50z8IIDQ65AZjp0M%2FvWFZAHavd2MOO7ZNj841Y84SNOFnogXSABuqLcRfxaGBLnUgJ4muAiQG%2BzPc0%2BCbG8TOEEhoYvQl1zA7dIra0KegXhNPFfxZ99K%2ForOZ5v3cAyBhugIhsDKBd5dkqTErcI2mKrWaqCRkoEN5TdpOt%2F0pn%2BuJsHO4Wl9c3QMZ%2BE6FlhlVyaWHthTAIyWxLQyPP%2BxVXXFkfgxAzU7K6VsQJMxWHDyq0R0xhVWVlnetbZPpFdfcNZ43iFSht2rCCqKcwTocFMR1ZL73gln3uaqoR4qmbgfailikIa%2BQc8XVs1L7EN171QuMwNAK%2F3Tsvai2x7Ke0XV0HIwCQw7no0dfc8WjXL72qORVyuFgVmdq7kRAg9Hz7UirgiPEe9K%2FqqlTdrJwJwaPVfgIwaOKs10bGxp0ER9n9ETFSauyLr7rX1Rtc51FCAFwgwla7arAY6sgGKd6GSd3Gp4rz4qCZb29465G8RVJYXsbBSZs7D3YZdDWsIbDZI%2FqviYLBgMTVGhF%2FGL%2BjCh0Jmy6z82m%2FpBzlsRskrayHKzSfkkZoH3OUEqX5hKNqUZZIHn4J4SFVjXT0nBU5cKBqRMWEgNW1AcDUniMbNXhchrSz2UE2F%2FHm4oG2vS%2FriiLtq3QECNQ1k0ZZwvRnzKDX06xleTFyTSPOitom97odrw3hxs8Q8JLP8BwtH&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240104T120117Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFDGFIW5WC%2F20240104%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=ab8853ba63d3e4d9436851e608d8faeb0ae7442e2ddb0e992fe12851f8966aac",
        "width": 200,
        "height": 200
      },
      "REGULAR": {
        "url": "https://edamam-product-images.s3.amazonaws.com/web-img/c4a/c4a8702514334014258599844922c806.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEyydw%2FQjBOTP5AEDcSEszSKDzT52tK8TSD6wdvDstPhAiBVlCbLUKjaqKbLq5GQ%2FAoSCJrvOl85fQ6bsCqbs2aY7iq5BQh1EAAaDDE4NzAxNzE1MDk4NiIMNQjuzoCAqAEbHe%2FcKpYFQs3Xhu%2FsFlNloIJIpTNnLuH19JBrU7jjk68YNSvML53lqUaZXWEYyFS6HhyosBrwBt8PTtTEC5TAx7T1iTEmR4bePyJsnrHS6iXflBjrTIDjh%2Bntj8I10NSPhgSBRXAwFH8RuXd3gPyzzQ5Rm%2B4x2G1FuNViWZOcVX8H3giYKVFWeiv9LKO%2FoPFkkZKYvfG%2BDSGg4On84ZHlfuQgmaUm7fAcujLgoPjFg3ZlWItH9%2BS0PkcX4bszqphQRJDwb33psyNzN9xtzmrKE6p%2FnHMC6m0JxssCkkWJPhyqQfROpwGPswa5uY5OnZ9o29UJbJ8Vhjdm%2FHCQ3d%2BYDUmjeH6L%2Br4FpgpYNVYsKUu3681%2BSvdnDg9HdELaPmYUQpnbPsJEXJ5AE3S7EFwoIoV0%2FP0Wnp%2FI2UmpGR%2F7m5th91ust2m8y50z8IIDQ65AZjp0M%2FvWFZAHavd2MOO7ZNj841Y84SNOFnogXSABuqLcRfxaGBLnUgJ4muAiQG%2BzPc0%2BCbG8TOEEhoYvQl1zA7dIra0KegXhNPFfxZ99K%2ForOZ5v3cAyBhugIhsDKBd5dkqTErcI2mKrWaqCRkoEN5TdpOt%2F0pn%2BuJsHO4Wl9c3QMZ%2BE6FlhlVyaWHthTAIyWxLQyPP%2BxVXXFkfgxAzU7K6VsQJMxWHDyq0R0xhVWVlnetbZPpFdfcNZ43iFSht2rCCqKcwTocFMR1ZL73gln3uaqoR4qmbgfailikIa%2BQc8XVs1L7EN171QuMwNAK%2F3Tsvai2x7Ke0XV0HIwCQw7no0dfc8WjXL72qORVyuFgVmdq7kRAg9Hz7UirgiPEe9K%2FqqlTdrJwJwaPVfgIwaOKs10bGxp0ER9n9ETFSauyLr7rX1Rtc51FCAFwgwla7arAY6sgGKd6GSd3Gp4rz4qCZb29465G8RVJYXsbBSZs7D3YZdDWsIbDZI%2FqviYLBgMTVGhF%2FGL%2BjCh0Jmy6z82m%2FpBzlsRskrayHKzSfkkZoH3OUEqX5hKNqUZZIHn4J4SFVjXT0nBU5cKBqRMWEgNW1AcDUniMbNXhchrSz2UE2F%2FHm4oG2vS%2FriiLtq3QECNQ1k0ZZwvRnzKDX06xleTFyTSPOitom97odrw3hxs8Q8JLP8BwtH&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240104T120117Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFDGFIW5WC%2F20240104%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=1cc21fd780eeed72b768d67a4c80d98200ac248ba5af693aab5381329eed9e9b",
        "width": 300,
        "height": 300
      },
      "LARGE": {
        "url": "https://edamam-product-images.s3.amazonaws.com/web-img/c4a/c4a8702514334014258599844922c806-l.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEyydw%2FQjBOTP5AEDcSEszSKDzT52tK8TSD6wdvDstPhAiBVlCbLUKjaqKbLq5GQ%2FAoSCJrvOl85fQ6bsCqbs2aY7iq5BQh1EAAaDDE4NzAxNzE1MDk4NiIMNQjuzoCAqAEbHe%2FcKpYFQs3Xhu%2FsFlNloIJIpTNnLuH19JBrU7jjk68YNSvML53lqUaZXWEYyFS6HhyosBrwBt8PTtTEC5TAx7T1iTEmR4bePyJsnrHS6iXflBjrTIDjh%2Bntj8I10NSPhgSBRXAwFH8RuXd3gPyzzQ5Rm%2B4x2G1FuNViWZOcVX8H3giYKVFWeiv9LKO%2FoPFkkZKYvfG%2BDSGg4On84ZHlfuQgmaUm7fAcujLgoPjFg3ZlWItH9%2BS0PkcX4bszqphQRJDwb33psyNzN9xtzmrKE6p%2FnHMC6m0JxssCkkWJPhyqQfROpwGPswa5uY5OnZ9o29UJbJ8Vhjdm%2FHCQ3d%2BYDUmjeH6L%2Br4FpgpYNVYsKUu3681%2BSvdnDg9HdELaPmYUQpnbPsJEXJ5AE3S7EFwoIoV0%2FP0Wnp%2FI2UmpGR%2F7m5th91ust2m8y50z8IIDQ65AZjp0M%2FvWFZAHavd2MOO7ZNj841Y84SNOFnogXSABuqLcRfxaGBLnUgJ4muAiQG%2BzPc0%2BCbG8TOEEhoYvQl1zA7dIra0KegXhNPFfxZ99K%2ForOZ5v3cAyBhugIhsDKBd5dkqTErcI2mKrWaqCRkoEN5TdpOt%2F0pn%2BuJsHO4Wl9c3QMZ%2BE6FlhlVyaWHthTAIyWxLQyPP%2BxVXXFkfgxAzU7K6VsQJMxWHDyq0R0xhVWVlnetbZPpFdfcNZ43iFSht2rCCqKcwTocFMR1ZL73gln3uaqoR4qmbgfailikIa%2BQc8XVs1L7EN171QuMwNAK%2F3Tsvai2x7Ke0XV0HIwCQw7no0dfc8WjXL72qORVyuFgVmdq7kRAg9Hz7UirgiPEe9K%2FqqlTdrJwJwaPVfgIwaOKs10bGxp0ER9n9ETFSauyLr7rX1Rtc51FCAFwgwla7arAY6sgGKd6GSd3Gp4rz4qCZb29465G8RVJYXsbBSZs7D3YZdDWsIbDZI%2FqviYLBgMTVGhF%2FGL%2BjCh0Jmy6z82m%2FpBzlsRskrayHKzSfkkZoH3OUEqX5hKNqUZZIHn4J4SFVjXT0nBU5cKBqRMWEgNW1AcDUniMbNXhchrSz2UE2F%2FHm4oG2vS%2FriiLtq3QECNQ1k0ZZwvRnzKDX06xleTFyTSPOitom97odrw3hxs8Q8JLP8BwtH&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240104T120117Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFDGFIW5WC%2F20240104%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=5667dcd1058866222b26185c6de792345e5db65b54d35444ddcb5ad8b2147388",
        "width": 600,
        "height": 600
      }
    },
    "source": "theglutenfree.com",
    "url": "http://www.theglutenfree.com/gluten-free-chicken-teriyaki-kabobs/",
    "shareAs": "http://www.edamam.com/recipe/gluten-free-chicken-teriyaki-kabobs-926f6ae64fad4eba9f4e936e564cb722/-/alcohol-free/dairy-free/high-protein",
    "yield": 8,
    "dietLabels": [
      "High-Protein",
      "Low-Carb"
    ],
    "healthLabels": [
      "Dairy-Free",
      "Gluten-Free",
      "Wheat-Free",
      "Egg-Free",
      "Peanut-Free",
      "Tree-Nut-Free",
      "Fish-Free",
      "Shellfish-Free",
      "Pork-Free",
      "Red-Meat-Free",
      "Crustacean-Free",
      "Celery-Free",
      "Mustard-Free",
      "Lupine-Free",
      "Mollusk-Free",
      "Alcohol-Free",
      "Kosher"
    ],
    "cautions": [],
    "ingredientLines": [
      "* 4 skinless chicken breast,",
      "* 1/2 cup tamari soy sauce gluten free",
      "* 1 tablespoon toasted sesame oil",
      "* 1 tablespoon toasted sesame seed",
      "* 1/3 cup brown sugar",
      "* e fresh ginger, grated",
      "* 10 garlic clove, minced",
      "* salt and black pepper",
      "* 3 green onion, sliced"
    ],
    "ingredients": [
      {
        "text": "* 4 skinless chicken breast,",
        "quantity": 4,
        "measure": "<unit>",
        "food": "skinless chicken breast",
        "weight": 1088,
        "foodCategory": "Poultry",
        "foodId": "food_bdrxu94aj3x2djbpur8dhagfhkcn",
        "image": "https://www.edamam.com/food-img/da5/da510379d3650787338ca16fb69f4c94.jpg"
      },
      {
        "text": "* 1/2 cup tamari soy sauce gluten free",
        "quantity": 0.5,
        "measure": "cup",
        "food": "tamari soy sauce",
        "weight": 144.00000000243458,
        "foodCategory": "plant-based protein",
        "foodId": "food_al3j2qwa04zybuafc1twwap4umvy",
        "image": "https://www.edamam.com/food-img/f52/f5263a232df96ad21cf2120e05c941ae.jpg"
      },
      {
        "text": "* 1 tablespoon toasted sesame oil",
        "quantity": 1,
        "measure": "tablespoon",
        "food": "toasted sesame oil",
        "weight": 13.6,
        "foodCategory": "Oils",
        "foodId": "food_b2id9opa0l5afvbw2do5xa1fnz4q",
        "image": "https://www.edamam.com/food-img/b87/b874ddcfb6770adc7a155355a902ffb8.jpg"
      },
      {
        "text": "* 1 tablespoon toasted sesame seed",
        "quantity": 1,
        "measure": "tablespoon",
        "food": "sesame seed",
        "weight": 9,
        "foodCategory": "plant-based protein",
        "foodId": "food_bvxfnx8bwz2q3abs04kd6bbuf9w8",
        "image": "https://www.edamam.com/food-img/291/291b355a7a0948716243164427697279.jpg"
      },
      {
        "text": "* 1/3 cup brown sugar",
        "quantity": 0.3333333333333333,
        "measure": "cup",
        "food": "brown sugar",
        "weight": 48.33333333333333,
        "foodCategory": "sugars",
        "foodId": "food_aodgtqwbmeu5f6bxeffn0art3bga",
        "image": "https://www.edamam.com/food-img/8c6/8c6662bd73900645c6385b51a95d9b03.jpg"
      },
      {
        "text": "* e fresh ginger, grated",
        "quantity": 0,
        "measure": null,
        "food": "fresh ginger",
        "weight": 27.492000000048687,
        "foodCategory": "vegetables",
        "foodId": "food_bi2ki2xb5zmmvbaiwf7ztbgktzp6",
        "image": "https://www.edamam.com/food-img/b9c/b9c06ef451ef29513880af0a53ebbaa6.jpg"
      },
      {
        "text": "* 10 garlic clove, minced",
        "quantity": 10,
        "measure": "clove",
        "food": "garlic",
        "weight": 30,
        "foodCategory": "vegetables",
        "foodId": "food_avtcmx6bgjv1jvay6s6stan8dnyp",
        "image": "https://www.edamam.com/food-img/6ee/6ee142951f48aaf94f4312409f8d133d.jpg"
      },
      {
        "text": "* salt and black pepper",
        "quantity": 0,
        "measure": null,
        "food": "salt",
        "weight": 8.247600000014607,
        "foodCategory": "Condiments and sauces",
        "foodId": "food_btxz81db72hwbra2pncvebzzzum9",
        "image": "https://www.edamam.com/food-img/694/6943ea510918c6025795e8dc6e6eaaeb.jpg"
      },
      {
        "text": "* salt and black pepper",
        "quantity": 0,
        "measure": null,
        "food": "black pepper",
        "weight": 4.123800000007304,
        "foodCategory": "Condiments and sauces",
        "foodId": "food_b6ywzluaaxv02wad7s1r9ag4py89",
        "image": "https://www.edamam.com/food-img/c6e/c6e5c3bd8d3bc15175d9766971a4d1b2.jpg"
      },
      {
        "text": "* 3 green onion, sliced",
        "quantity": 3,
        "measure": "<unit>",
        "food": "green onion",
        "weight": 41.66666666666667,
        "foodCategory": "vegetables",
        "foodId": "food_bknlkyzbuzo27pb11whr4bttkuy6",
        "image": "https://www.edamam.com/food-img/b89/b89986ed6aa466285bdd99bac34b3c46.jpg"
      }
    ],
    "calories": 1837.838338001518,
    "totalCO2Emissions": 11465.87110884774,
    "co2EmissionsClass": "F",
    "totalWeight": 1406.2158000024904,
    "totalTime": 0,
    "cuisineType": [
      "japanese"
    ],
    "mealType": [
      "lunch/dinner"
    ],
    "dishType": [
      "main course"
    ],
    "totalNutrients": {
      "ENERC_KCAL": {
        "label": "Energy",
        "quantity": 1837.838338001518,
        "unit": "kcal"
      },
      "FAT": {
        "label": "Fat",
        "quantity": 47.29239254666971,
        "unit": "g"
      },
      "FASAT": {
        "label": "Saturated",
        "quantity": 8.852042913333804,
        "unit": "g"
      },
      "FATRN": {
        "label": "Trans",
        "quantity": 0.07616,
        "unit": "g"
      },
      "FAMS": {
        "label": "Monounsaturated",
        "quantity": 14.699362562000543,
        "unit": "g"
      },
      "FAPU": {
        "label": "Polyunsaturated",
        "quantity": 12.498706537334556,
        "unit": "g"
      },
      "CHOCDF": {
        "label": "Carbs",
        "quantity": 78.06294133348227,
        "unit": "g"
      },
      "CHOCDF.net": {
        "label": "Carbohydrates (net)",
        "quantity": 72.54244660012664,
        "unit": "g"
      },
      "FIBTG": {
        "label": "Fiber",
        "quantity": 5.520494733355632,
        "unit": "g"
      },
      "SUGAR": {
        "label": "Sugars",
        "quantity": 51.12292298670892,
        "unit": "g"
      },
      "SUGAR.added": {
        "label": "Sugars, added",
        "quantity": 46.883333333333326,
        "unit": "g"
      },
      "PROCNT": {
        "label": "Protein",
        "quantity": 265.1707296002573,
        "unit": "g"
      },
      "CHOLE": {
        "label": "Cholesterol",
        "quantity": 794.24,
        "unit": "mg"
      },
      "NA": {
        "label": "Sodium",
        "quantity": 8569.8887201361,
        "unit": "mg"
      },
      "CA": {
        "label": "Calcium",
        "quantity": 318.0338206671937,
        "unit": "mg"
      },
      "MG": {
        "label": "Magnesium",
        "quantity": 432.8865913343406,
        "unit": "mg"
      },
      "K": {
        "label": "Potassium",
        "quantity": 4449.841673338794,
        "unit": "mg"
      },
      "FE": {
        "label": "Iron",
        "quantity": 10.802006313392278,
        "unit": "mg"
      },
      "ZN": {
        "label": "Zinc",
        "quantity": 9.382646020010723,
        "unit": "mg"
      },
      "P": {
        "label": "Phosphorus",
        "quantity": 2640.362884003193,
        "unit": "mg"
      },
      "VITA_RAE": {
        "label": "Vitamin A",
        "quantity": 119.8667593333353,
        "unit": "µg"
      },
      "VITC": {
        "label": "Vitamin C",
        "quantity": 18.56793333333577,
        "unit": "mg"
      },
      "THIA": {
        "label": "Thiamin (B1)",
        "quantity": 1.2731133706681232,
        "unit": "mg"
      },
      "RIBF": {
        "label": "Riboflavin (B2)",
        "quantity": 2.2499734533370637,
        "unit": "mg"
      },
      "NIA": {
        "label": "Niacin (B3)",
        "quantity": 111.27791798676328,
        "unit": "mg"
      },
      "VITB6A": {
        "label": "Vitamin B6",
        "quantity": 9.656000791338304,
        "unit": "mg"
      },
      "FOLDFE": {
        "label": "Folate equivalent (total)",
        "quantity": 164.3451660004448,
        "unit": "µg"
      },
      "FOLFD": {
        "label": "Folate (food)",
        "quantity": 164.3451660004448,
        "unit": "µg"
      },
      "FOLAC": {
        "label": "Folic acid",
        "quantity": 0,
        "unit": "µg"
      },
      "VITB12": {
        "label": "Vitamin B12",
        "quantity": 2.2848,
        "unit": "µg"
      },
      "VITD": {
        "label": "Vitamin D",
        "quantity": 0,
        "unit": "µg"
      },
      "TOCPHA": {
        "label": "Vitamin E",
        "quantity": 6.673233386666872,
        "unit": "mg"
      },
      "VITK1": {
        "label": "Vitamin K",
        "quantity": 95.40012400001204,
        "unit": "µg"
      },
      "WATER": {
        "label": "Water",
        "quantity": 977.3450963349796,
        "unit": "g"
      }
    },
    "totalDaily": {
      "ENERC_KCAL": {
        "label": "Energy",
        "quantity": 91.8919169000759,
        "unit": "%"
      },
      "FAT": {
        "label": "Fat",
        "quantity": 72.75752699487647,
        "unit": "%"
      },
      "FASAT": {
        "label": "Saturated",
        "quantity": 44.26021456666902,
        "unit": "%"
      },
      "CHOCDF": {
        "label": "Carbs",
        "quantity": 26.02098044449409,
        "unit": "%"
      },
      "FIBTG": {
        "label": "Fiber",
        "quantity": 22.081978933422523,
        "unit": "%"
      },
      "PROCNT": {
        "label": "Protein",
        "quantity": 530.3414592005146,
        "unit": "%"
      },
      "CHOLE": {
        "label": "Cholesterol",
        "quantity": 264.74666666666667,
        "unit": "%"
      },
      "NA": {
        "label": "Sodium",
        "quantity": 357.0786966723375,
        "unit": "%"
      },
      "CA": {
        "label": "Calcium",
        "quantity": 31.803382066719372,
        "unit": "%"
      },
      "MG": {
        "label": "Magnesium",
        "quantity": 103.06823603198586,
        "unit": "%"
      },
      "K": {
        "label": "Potassium",
        "quantity": 94.6774824114637,
        "unit": "%"
      },
      "FE": {
        "label": "Iron",
        "quantity": 60.01114618551266,
        "unit": "%"
      },
      "ZN": {
        "label": "Zinc",
        "quantity": 85.29678200009748,
        "unit": "%"
      },
      "P": {
        "label": "Phosphorus",
        "quantity": 377.19469771474184,
        "unit": "%"
      },
      "VITA_RAE": {
        "label": "Vitamin A",
        "quantity": 13.318528814815034,
        "unit": "%"
      },
      "VITC": {
        "label": "Vitamin C",
        "quantity": 20.631037037039746,
        "unit": "%"
      },
      "THIA": {
        "label": "Thiamin (B1)",
        "quantity": 106.09278088901027,
        "unit": "%"
      },
      "RIBF": {
        "label": "Riboflavin (B2)",
        "quantity": 173.07488102592797,
        "unit": "%"
      },
      "NIA": {
        "label": "Niacin (B3)",
        "quantity": 695.4869874172705,
        "unit": "%"
      },
      "VITB6A": {
        "label": "Vitamin B6",
        "quantity": 742.7692916414079,
        "unit": "%"
      },
      "FOLDFE": {
        "label": "Folate equivalent (total)",
        "quantity": 41.0862915001112,
        "unit": "%"
      },
      "VITB12": {
        "label": "Vitamin B12",
        "quantity": 95.20000000000002,
        "unit": "%"
      },
      "VITD": {
        "label": "Vitamin D",
        "quantity": 0,
        "unit": "%"
      },
      "TOCPHA": {
        "label": "Vitamin E",
        "quantity": 44.48822257777915,
        "unit": "%"
      },
      "VITK1": {
        "label": "Vitamin K",
        "quantity": 79.50010333334336,
        "unit": "%"
      }
    },
    "digest": [
      {
        "label": "Fat",
        "tag": "FAT",
        "schemaOrgTag": "fatContent",
        "total": 47.29239254666971,
        "hasRDI": true,
        "daily": 72.75752699487647,
        "unit": "g",
        "sub": [
          {
            "label": "Saturated",
            "tag": "FASAT",
            "schemaOrgTag": "saturatedFatContent",
            "total": 8.852042913333804,
            "hasRDI": true,
            "daily": 44.26021456666902,
            "unit": "g"
          },
          {
            "label": "Trans",
            "tag": "FATRN",
            "schemaOrgTag": "transFatContent",
            "total": 0.07616,
            "hasRDI": false,
            "daily": 0,
            "unit": "g"
          },
          {
            "label": "Monounsaturated",
            "tag": "FAMS",
            "schemaOrgTag": null,
            "total": 14.699362562000543,
            "hasRDI": false,
            "daily": 0,
            "unit": "g"
          },
          {
            "label": "Polyunsaturated",
            "tag": "FAPU",
            "schemaOrgTag": null,
            "total": 12.498706537334556,
            "hasRDI": false,
            "daily": 0,
            "unit": "g"
          }
        ]
      },
      {
        "label": "Carbs",
        "tag": "CHOCDF",
        "schemaOrgTag": "carbohydrateContent",
        "total": 78.06294133348227,
        "hasRDI": true,
        "daily": 26.02098044449409,
        "unit": "g",
        "sub": [
          {
            "label": "Carbs (net)",
            "tag": "CHOCDF.net",
            "schemaOrgTag": null,
            "total": 72.54244660012664,
            "hasRDI": false,
            "daily": 0,
            "unit": "g"
          },
          {
            "label": "Fiber",
            "tag": "FIBTG",
            "schemaOrgTag": "fiberContent",
            "total": 5.520494733355632,
            "hasRDI": true,
            "daily": 22.081978933422523,
            "unit": "g"
          },
          {
            "label": "Sugars",
            "tag": "SUGAR",
            "schemaOrgTag": "sugarContent",
            "total": 51.12292298670892,
            "hasRDI": false,
            "daily": 0,
            "unit": "g"
          },
          {
            "label": "Sugars, added",
            "tag": "SUGAR.added",
            "schemaOrgTag": null,
            "total": 46.883333333333326,
            "hasRDI": false,
            "daily": 0,
            "unit": "g"
          }
        ]
      },
      {
        "label": "Protein",
        "tag": "PROCNT",
        "schemaOrgTag": "proteinContent",
        "total": 265.1707296002573,
        "hasRDI": true,
        "daily": 530.3414592005146,
        "unit": "g"
      },
      {
        "label": "Cholesterol",
        "tag": "CHOLE",
        "schemaOrgTag": "cholesterolContent",
        "total": 794.24,
        "hasRDI": true,
        "daily": 264.74666666666667,
        "unit": "mg"
      },
      {
        "label": "Sodium",
        "tag": "NA",
        "schemaOrgTag": "sodiumContent",
        "total": 8569.8887201361,
        "hasRDI": true,
        "daily": 357.0786966723375,
        "unit": "mg"
      },
      {
        "label": "Calcium",
        "tag": "CA",
        "schemaOrgTag": null,
        "total": 318.0338206671937,
        "hasRDI": true,
        "daily": 31.803382066719372,
        "unit": "mg"
      },
      {
        "label": "Magnesium",
        "tag": "MG",
        "schemaOrgTag": null,
        "total": 432.8865913343406,
        "hasRDI": true,
        "daily": 103.06823603198586,
        "unit": "mg"
      },
      {
        "label": "Potassium",
        "tag": "K",
        "schemaOrgTag": null,
        "total": 4449.841673338794,
        "hasRDI": true,
        "daily": 94.6774824114637,
        "unit": "mg"
      },
      {
        "label": "Iron",
        "tag": "FE",
        "schemaOrgTag": null,
        "total": 10.802006313392278,
        "hasRDI": true,
        "daily": 60.01114618551266,
        "unit": "mg"
      },
      {
        "label": "Zinc",
        "tag": "ZN",
        "schemaOrgTag": null,
        "total": 9.382646020010723,
        "hasRDI": true,
        "daily": 85.29678200009748,
        "unit": "mg"
      },
      {
        "label": "Phosphorus",
        "tag": "P",
        "schemaOrgTag": null,
        "total": 2640.362884003193,
        "hasRDI": true,
        "daily": 377.19469771474184,
        "unit": "mg"
      },
      {
        "label": "Vitamin A",
        "tag": "VITA_RAE",
        "schemaOrgTag": null,
        "total": 119.8667593333353,
        "hasRDI": true,
        "daily": 13.318528814815034,
        "unit": "µg"
      },
      {
        "label": "Vitamin C",
        "tag": "VITC",
        "schemaOrgTag": null,
        "total": 18.56793333333577,
        "hasRDI": true,
        "daily": 20.631037037039746,
        "unit": "mg"
      },
      {
        "label": "Thiamin (B1)",
        "tag": "THIA",
        "schemaOrgTag": null,
        "total": 1.2731133706681232,
        "hasRDI": true,
        "daily": 106.09278088901027,
        "unit": "mg"
      },
      {
        "label": "Riboflavin (B2)",
        "tag": "RIBF",
        "schemaOrgTag": null,
        "total": 2.2499734533370637,
        "hasRDI": true,
        "daily": 173.07488102592797,
        "unit": "mg"
      },
      {
        "label": "Niacin (B3)",
        "tag": "NIA",
        "schemaOrgTag": null,
        "total": 111.27791798676328,
        "hasRDI": true,
        "daily": 695.4869874172705,
        "unit": "mg"
      },
      {
        "label": "Vitamin B6",
        "tag": "VITB6A",
        "schemaOrgTag": null,
        "total": 9.656000791338304,
        "hasRDI": true,
        "daily": 742.7692916414079,
        "unit": "mg"
      },
      {
        "label": "Folate equivalent (total)",
        "tag": "FOLDFE",
        "schemaOrgTag": null,
        "total": 164.3451660004448,
        "hasRDI": true,
        "daily": 41.0862915001112,
        "unit": "µg"
      },
      {
        "label": "Folate (food)",
        "tag": "FOLFD",
        "schemaOrgTag": null,
        "total": 164.3451660004448,
        "hasRDI": false,
        "daily": 0,
        "unit": "µg"
      },
      {
        "label": "Folic acid",
        "tag": "FOLAC",
        "schemaOrgTag": null,
        "total": 0,
        "hasRDI": false,
        "daily": 0,
        "unit": "µg"
      },
      {
        "label": "Vitamin B12",
        "tag": "VITB12",
        "schemaOrgTag": null,
        "total": 2.2848,
        "hasRDI": true,
        "daily": 95.20000000000002,
        "unit": "µg"
      },
      {
        "label": "Vitamin D",
        "tag": "VITD",
        "schemaOrgTag": null,
        "total": 0,
        "hasRDI": true,
        "daily": 0,
        "unit": "µg"
      },
      {
        "label": "Vitamin E",
        "tag": "TOCPHA",
        "schemaOrgTag": null,
        "total": 6.673233386666872,
        "hasRDI": true,
        "daily": 44.48822257777915,
        "unit": "mg"
      },
      {
        "label": "Vitamin K",
        "tag": "VITK1",
        "schemaOrgTag": null,
        "total": 95.40012400001204,
        "hasRDI": true,
        "daily": 79.50010333334336,
        "unit": "µg"
      },
      {
        "label": "Sugar alcohols",
        "tag": "Sugar.alcohol",
        "schemaOrgTag": null,
        "total": 0,
        "hasRDI": false,
        "daily": 0,
        "unit": "g"
      },
      {
        "label": "Water",
        "tag": "WATER",
        "schemaOrgTag": null,
        "total": 977.3450963349796,
        "hasRDI": false,
        "daily": 0,
        "unit": "g"
      }
    ]
  }

export default recipeTest;